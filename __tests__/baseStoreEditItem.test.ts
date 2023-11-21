import {
    BaseStoreEditItem,
    CallbackSaveModifiedItemParams,
    InitDataBaseStoreEditItem
} from "../dist";

interface TestDataType {
    readonly a: string;
    readonly b: number;
    readonly c: boolean;
    readonly d: Date | null;
    readonly e: number[];
    readonly f: string[]
}

function GET_TEST_DATA_STATIC(): TestDataType {
    return {
        a: 'Lorem ipsum dolor sit amet, te eum aeque quaestio pertinacia',
        b: 1,
        c: false,
        d: new Date('2023-01-01'),
        e: [1, 2, 4],
        f: ['1', '2', '4'],
    }
}

class StoreEditItemTest1 extends BaseStoreEditItem<TestDataType> {

    protected override _validationModifiedItemOverride(): void {
        this._saveModifiedItem({
            item:{
                a: 'ChangeText',
                b: 2,
                c: true,
                d: new Date('2023-01-02'),
                e: [6, 7, 8, 9],
                f: ['9', '8', '7'],
            },
            status: 'existingItem',
            other: undefined
        });
    }

    constructor(initData: InitDataBaseStoreEditItem<TestDataType>) {
        super(initData);
    }
}

class StoreEditItemTest2 extends BaseStoreEditItem<TestDataType> {

    protected override _validationModifiedItemOverride(): void {
        this._saveModifiedItem(
            {
                item: this._getItemToEditBeforeChanges(),
                status: 'existingItem',
                other: undefined
            }
        );
    }



    protected _saveModifiedItemOverride(): CallbackSaveModifiedItemParams<TestDataType> {
        return {
            item: this._getItemToEditBeforeChanges(),
            status: 'existingItem',
            other: undefined
        }
    }

    constructor(initData: InitDataBaseStoreEditItem<TestDataType>) {
        super(initData);
    }
}

test('itemStatus newItem', () => {
    const storeEditItem: StoreEditItemTest1 = new StoreEditItemTest1({
        callbackCancelEditItem:()=> {},
        callbackSaveModifiedItem: (params)=>{},
        itemToEdit: GET_TEST_DATA_STATIC(),
        itemStatus: 'newItem',
    });

    expect(storeEditItem.itemStatus).toStrictEqual('newItem');
});

test('itemStatus existingItem', () => {
    const storeEditItem: StoreEditItemTest1 = new StoreEditItemTest1({
        callbackCancelEditItem:()=> {},
        callbackSaveModifiedItem: (params)=>{},
        itemToEdit: GET_TEST_DATA_STATIC(),
        itemStatus: 'existingItem',
    });

    expect(storeEditItem.itemStatus).toStrictEqual('existingItem');
});

test('itemStatus change', () => {
    const storeEditItem: StoreEditItemTest1 = new StoreEditItemTest1({
        callbackCancelEditItem:()=> {},
        callbackSaveModifiedItem: (params)=>{},
        itemToEdit: GET_TEST_DATA_STATIC(),
        itemStatus: 'newItem',
    });

    storeEditItem.setItemStatus('existingItem');
    expect(storeEditItem.itemStatus).toStrictEqual('existingItem');
});

test('callbackSaveModifiedItem', () => {
    let result: undefined | TestDataType = undefined;
    const storeEditItem: StoreEditItemTest1 = new StoreEditItemTest1({
        callbackCancelEditItem:()=> {},
        callbackSaveModifiedItem: (params)=>{
            result = params.item;
        },
        itemToEdit: GET_TEST_DATA_STATIC(),
        itemStatus: 'newItem',
    });

    storeEditItem.eventSaveModifiedItem();

    expect(result).toStrictEqual({
        a: 'ChangeText',
        b: 2,
        c: true,
        d: new Date('2023-01-02'),
        e: [6, 7, 8, 9],
        f: ['9', '8', '7'],
    });
});

test('itemToEditBeforeChanges', () => {
    const storeEditItem: StoreEditItemTest1 = new StoreEditItemTest1({
        callbackCancelEditItem:()=> {},
        callbackSaveModifiedItem: (params)=>{},
        itemToEdit: GET_TEST_DATA_STATIC(),
        itemStatus: 'newItem',
    });

    expect(storeEditItem.itemToEditBeforeChanges).toStrictEqual(GET_TEST_DATA_STATIC());
});

test('callbackSaveModifiedItem', () => {
    let result: undefined | TestDataType = undefined;
    const storeEditItem: StoreEditItemTest2 = new StoreEditItemTest2({
        callbackCancelEditItem:()=> {},
        callbackSaveModifiedItem: (params)=>{
            result = params.item;
        },
        itemToEdit: GET_TEST_DATA_STATIC(),
        itemStatus: 'newItem',
    });

    storeEditItem.eventSaveModifiedItem();
    expect(result).toStrictEqual(undefined);
});

test('editorStatus default', () => {
    const storeEditItem: StoreEditItemTest2 = new StoreEditItemTest2({
        callbackCancelEditItem:()=> {},
        callbackSaveModifiedItem: (params)=>{},
        itemToEdit: GET_TEST_DATA_STATIC(),
        itemStatus: 'newItem',
    });

    expect(storeEditItem.editorStatus).toStrictEqual({
        status: 'editItem'
    });
});

test('editorStatus setEditorStatus', () => {
    const storeEditItem: StoreEditItemTest2 = new StoreEditItemTest2({
        callbackCancelEditItem:()=> {},
        callbackSaveModifiedItem: (params)=>{},
        itemToEdit: GET_TEST_DATA_STATIC(),
        itemStatus: 'newItem',
    });

    storeEditItem.setEditorStatus({
        status: 'hide'
    });

    expect(storeEditItem.editorStatus).toStrictEqual({
        status: 'hide'
    });
});

test('eventCancelEditItem', () => {
    let result: boolean  = false;
    const storeEditItem: StoreEditItemTest2 = new StoreEditItemTest2({
        callbackCancelEditItem:()=> {result = true;},
        callbackSaveModifiedItem: (params)=>{},
        itemToEdit: GET_TEST_DATA_STATIC(),
        itemStatus: 'newItem',
    });
    storeEditItem.eventCancelEditItem();

    expect(result).toStrictEqual(true);
});

// test('eventCancelEditItem wrong type123', () => {

//     // @ts-ignore
//     const storeEditItem: StoreEditItemTest2 = new StoreEditItemTest2({
//         // @ts-ignore
//         callbackCancelEditItem: 123,
//         callbackSaveModifiedItem: (params)=>{},
//         itemToEdit: GET_TEST_DATA_STATIC(),
//         itemStatus: 'newItem',
//     });
    
//     expect(storeEditItem.eventCancelEditItem()).toThrow('_callbackCancelEditItem is not a function')
// });

// test('eventSaveModifiedItem wrong type', () => {
//     // @ts-ignore
//     const storeEditItem: StoreEditItemTest2 = new StoreEditItemTest2({
//         // @ts-ignore
//         callbackCancelEditItem: 123,
//         // @ts-ignore
//         callbackSaveModifiedItem: 456,
//         itemToEdit: GET_TEST_DATA_STATIC(),
//         itemStatus: 'newItem',
//     });
//     storeEditItem.eventSaveModifiedItem();
//     expect(() => Error).not.toThrow(Error)
// });
