import StoreDataSource, {
    DataSourceItem,
    ListenerChangeDataSource
} from "../src/storeDataSource";
import {v4 as uuidv4} from 'uuid';

interface TestDataType extends DataSourceItem {
    readonly fieldString: string;
    readonly fieldNumber: number;
    readonly fieldDate: Date;
    readonly fieldBoolean: boolean;
    readonly fieldObject: {
        readonly a: number;
        readonly b: string;
        readonly c: boolean;
        readonly d: Date;
    }
}

function GET_TEST_ITEM(): TestDataType {
    return {
        uuid: uuidv4(),
        fieldBoolean: true,
        fieldDate: new Date(),
        fieldNumber: 0,
        fieldString: 'Lorem ipsum dolor sit amet, harum utamur accumsan in duo',
        fieldObject: {
            a: 0,
            b: 'Lorem ipsum dolor sit amet, sit tale expetenda explicari et, no cum etiam constituto, no mei ubique putent facilisi. In natum omittantur nec',
            c: false,
            d: new Date()
        }
    }
}

function GET_TEST_DATA(itemsCount: number): TestDataType[] {
    const result: TestDataType[] = [];

    for (let i = 0; i < itemsCount; ++i) {
        result.push({
            uuid: uuidv4(),
            fieldBoolean: (i % 2) == 0,
            fieldDate: new Date(),
            fieldNumber: i,
            fieldString: `Lorem ipsum dolor sit amet, harum utamur accumsan in duo, ornatus quaerendum ex quo. Amet laudem ut cum. Vel enim graece ut, id tantas inimicus hendrerit sed. Usu semper menandri disputationi te, primis partiendo mei ea, duis alienum vel at. Harum disputationi ius ei, ex idque altera expetendis pri. Alii blandit consectetuer at usu.

Amet exerci invenire at quo. Debet alterum in mel, suas stet offendit pro id, est ea veri lorem. Volutpat scripserit signiferumque ut nam, eu adhuc adolescens sadipscing vis, est oportere dissentias liberavisse ut. Est labore assentior no.

Ne his accumsan comprehensam. Elit atqui theophrastus pri cu, in error mucius vix, cu duo accumsan petentium. Utinam volumus ad nam, eam cu eros invidunt omittantur. Ut error altera maiorum eos. Scripta phaedrum imperdiet ius eu.

Nisl unum aeterno et mei, nec diceret omnesque eu. Liber nusquam sententiae an usu, in pri movet nihil mentitum. Ea ipsum consulatu vel. Solum sonet semper ea vis, vim fabulas nominavi indoctum no, meis illum eleifend eos in. Wisi delectus singulis cu cum, nam legere alterum rationibus an, quando insolens te has. Sanctus hendrerit necessitatibus te pri, at quis ullum vix.

Cum semper necessitatibus ei, audiam iracundia consequuntur ex nam, his ea magna noster definitiones. Ea graece dolorum antiopam qui, duo ad ubique invidunt, et consequat dissentiet accommodare nec. Ei quot dicta labitur cum, in mel fuisset accommodare. Ea duo erant malorum nostrud, mea commodo hendrerit id, wisi habeo diceret cu sit. Te mei alterum delenit molestiae, ne lorem theophrastus sea. Cu dolor impedit pertinacia vel, stet mucius eripuit vix et.

Mei enim quodsi no, mea suscipit consequuntur an, vis etiam vocent persequeris cu. Ad dicat dissentiet pro. Vix bonorum civibus ea. Mel cu eirmod verear tractatos, sed ex nemore blandit detracto.

Ea cum putent ancillae, vim id nisl contentiones. Eum option fabulas an, natum volumus at sit, natum errem causae nec in. Harum doctus prompta eam ea, at pri cetero noluisse. Mel disputando complectitur et. Mea legere nonumes id, aeque elaboraret te sed, integre sapientem democritum ius te. Mea ea zril laboramus argumentum, no magna gubergren sententiae sit.`,
            fieldObject: {
                a: i,
                b: 'Lorem ipsum dolor sit amet, sit tale expetenda explicari et, no cum etiam constituto, no mei ubique putent facilisi. In natum omittantur nec',
                c: (i % 2) == 0,
                d: new Date()
            }
        });
    }

    return result;
}

function GET_TEST_DATA_STATIC(): TestDataType[] {
    const result: TestDataType[] = [
        {
            uuid: uuidv4(),
            fieldBoolean: true,
            fieldDate: new Date(),
            fieldNumber: 0,
            fieldString: `0_test`,
            fieldObject: {
                a: 0,
                b: `0_b`,
                c: true,
                d: new Date()
            }
        },
        {
            uuid: uuidv4(),
            fieldBoolean: false,
            fieldDate: new Date(),
            fieldNumber: 1,
            fieldString: `1_test`,
            fieldObject: {
                a: 1,
                b: `1_b`,
                c: false,
                d: new Date()
            }
        },
        {
            uuid: uuidv4(),
            fieldBoolean: false,
            fieldDate: new Date(),
            fieldNumber: 2,
            fieldString: `2_test`,
            fieldObject: {
                a: 2,
                b: `2_b`,
                c: false,
                d: new Date()
            }
        },
        {
            uuid: uuidv4(),
            fieldBoolean: false,
            fieldDate: new Date(),
            fieldNumber: 3,
            fieldString: `3_test`,
            fieldObject: {
                a: 3,
                b: `3_b`,
                c: false,
                d: new Date()
            }
        },
        {
            uuid: uuidv4(),
            fieldBoolean: true,
            fieldDate: new Date(),
            fieldNumber: 4,
            fieldString: `4_test`,
            fieldObject: {
                a: 4,
                b: `4_b`,
                c: true,
                d: new Date()
            }
        }
    ];


    return result;
}

test('Items count 0', () => {
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource([]);
    expect(testStoreDataSource.itemsCount).toStrictEqual(0);
});

test('Items count 2', () => {
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(GET_TEST_DATA(2));
    expect(testStoreDataSource.itemsCount).toStrictEqual(2);
});

test('Items count 10', () => {
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(GET_TEST_DATA(10));
    expect(testStoreDataSource.itemsCount).toStrictEqual(10);
});

test('Items count 50', () => {
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(GET_TEST_DATA(50));
    expect(testStoreDataSource.itemsCount).toStrictEqual(50);
});

test('Items count 100', () => {
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(GET_TEST_DATA(100));
    expect(testStoreDataSource.itemsCount).toStrictEqual(100);
});

test('Try get item by uuid 1', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.getItemByUuid(TEST_DATA[0].uuid)).toStrictEqual(TEST_DATA[0]);
});

test('Try get item by uuid 2', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.getItemByUuid(TEST_DATA[10].uuid)).toStrictEqual(TEST_DATA[10]);
});

test('Try get item by uuid 3', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.getItemByUuid(TEST_DATA[30].uuid)).toStrictEqual(TEST_DATA[30]);
});

test('Try get item by uuid 4', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.getItemByUuid(TEST_DATA[26].uuid)).toStrictEqual(TEST_DATA[26]);
});

test('Try get item by uuid 5', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.getItemByUuid(TEST_DATA[50].uuid)).toStrictEqual(TEST_DATA[50]);
});

test('Try get item by uuid 6', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.getItemByUuid(TEST_DATA[99].uuid)).toStrictEqual(TEST_DATA[99]);
});

test('Try get item by uuid 7', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.getItemByUuid(TEST_DATA[80].uuid)).toStrictEqual(TEST_DATA[80]);
});

test('Try get item by uuid empty uuid', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.getItemByUuid('')).toStrictEqual(undefined);
});

test('Try get item by uuid empty uuid', () => {
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    expect(testStoreDataSource.getItemByUuid('')).toStrictEqual(undefined);
});

test('Try get item by uuid wrong type number', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.getItemByUuid(100)).toStrictEqual(undefined);
});

test('Try get item by uuid wrong type Array', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.getItemByUuid([])).toStrictEqual(undefined);
});

test('Try get item by uuid wrong type Object', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.getItemByUuid({a: 1, b: 2})).toStrictEqual(undefined);
});

test('Try get item by uuid wrong type null', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.getItemByUuid(null)).toStrictEqual(undefined);
});

test('Try get item by uuid wrong type undefined', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.getItemByUuid(undefined)).toStrictEqual(undefined);
});

test('getItemsListByUuid', () => {
    const TEST_DATA = GET_TEST_DATA(20);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.getItemsListByUuid([TEST_DATA[0].uuid, TEST_DATA[1].uuid, TEST_DATA[2].uuid]))
        .toStrictEqual([TEST_DATA[0], TEST_DATA[1], TEST_DATA[2]]);
});

test('clearDataSource 1', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    testStoreDataSource.clearDataSource();
    expect(testStoreDataSource.itemsList).toStrictEqual([]);
});

test('clearDataSource 2', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    testStoreDataSource.clearDataSource();
    expect(testStoreDataSource.itemsCount).toStrictEqual(0);
});

test('Delete item by uuid', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.deleteItemByUuid(TEST_DATA[0].uuid)).toStrictEqual(true);
});

test('Delete item by uuid empty uuid', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.deleteItemByUuid('')).toStrictEqual(false);
});

test('Delete item by uuid not existing uuid', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.deleteItemByUuid('Lorem ipsum dolor sit amet')).toStrictEqual(false);
});

test('Try get removed item by uuid', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    testStoreDataSource.deleteItemByUuid(TEST_DATA[0].uuid);
    expect(testStoreDataSource.getItemByUuid(TEST_DATA[0].uuid)).toStrictEqual(undefined);
});

test('Delete item by uuid wrong type number', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.deleteItemByUuid(100)).toStrictEqual(false);
});

test('Delete item by uuid wrong type Array', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.deleteItemByUuid([])).toStrictEqual(false);
});

test('Delete item by uuid wrong type Object', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.deleteItemByUuid({a: 1, b: 2})).toStrictEqual(false);
});

test('Delete item by uuid wrong type null', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.deleteItemByUuid(null)).toStrictEqual(false);
});

test('Delete item by uuid wrong type undefined', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.deleteItemByUuid(undefined)).toStrictEqual(false);
});

test('Add new item', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    const newItem = GET_TEST_ITEM();
    expect(testStoreDataSource.addNewItem(newItem)).toStrictEqual(newItem);
});

test('Get new item by uuid', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    const newItem = GET_TEST_ITEM();
    testStoreDataSource.addNewItem(newItem)
    expect(testStoreDataSource.getItemByUuid(newItem.uuid)).toStrictEqual(newItem);
});

test('Add new item wrong type number', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.addNewItem(0)).toStrictEqual(undefined);
});

test('Add new item wrong type null', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.addNewItem(null)).toStrictEqual(undefined);
});

test('Add new item wrong type undefined', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.addNewItem(undefined)).toStrictEqual(undefined);
});

test('Add new item wrong type Array', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.addNewItem([])).toStrictEqual(undefined);
});

test('Add new item wrong type empty Object', () => {
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    // @ts-ignore
    const newItem = testStoreDataSource.addNewItem({})
    expect(newItem).toStrictEqual({uuid: newItem?.uuid});
});

test('Add new item wrong type Object without uuid', () => {
    const testStoreDataSource: StoreDataSource<{ uuid: string, a: number, b: number }> = new StoreDataSource<{ uuid: string, a: number, b: number }>();
    // @ts-ignore
    const newItem = testStoreDataSource.addNewItem({a: 1, b: 2})
    expect(newItem).toStrictEqual({uuid: newItem?.uuid, a: 1, b: 2});
});

test('Edit item', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    const editItem: TestDataType = {
        ...TEST_DATA[0],
        fieldDate: new Date(),
        fieldString: 'change text',
        fieldNumber: 100500
    };

    expect(testStoreDataSource.editItem(editItem)).toStrictEqual(editItem);
});

test('Get edit item by uuid', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);

    const editItem: TestDataType = {
        ...TEST_DATA[0],
        fieldDate: new Date(),
        fieldString: 'change text',
        fieldNumber: 100500
    };

    testStoreDataSource.editItem(editItem);
    expect(testStoreDataSource.getItemByUuid(editItem.uuid)).toStrictEqual(editItem);
});

test('Edit item wrong type number', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.editItem(0)).toStrictEqual(undefined);
});

test('Edit item wrong type null', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.editItem(null)).toStrictEqual(undefined);
});

test('Edit item wrong type undefined', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.editItem(undefined)).toStrictEqual(undefined);
});

test('Edit item wrong type Array', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.editItem([])).toStrictEqual(undefined);
});

test('Edit item wrong type empty Object', () => {
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    // @ts-ignore
    const newItem = testStoreDataSource.editItem({})
    expect(newItem).toStrictEqual(undefined);
});

test('Edit item wrong type Object without uuid', () => {
    const testStoreDataSource: StoreDataSource<{ uuid: string, a: number, b: number }> = new StoreDataSource<{ uuid: string, a: number, b: number }>();
    // @ts-ignore
    const newItem = testStoreDataSource.editItem({a: 1, b: 2})
    expect(newItem).toStrictEqual(undefined);
});

test('Delete items list by uuid 1', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.deleteItemsListByUuid([TEST_DATA[0].uuid, TEST_DATA[1].uuid, TEST_DATA[2].uuid])).toStrictEqual(true);
});


test('Delete items list by uuid 2', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    const isDelete: boolean = testStoreDataSource.deleteItemsListByUuid([TEST_DATA[0].uuid, '111', '222']);
    expect(isDelete).toStrictEqual(false);
});

test('Count items after delete items list by uuid', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    testStoreDataSource.deleteItemsListByUuid([TEST_DATA[0].uuid, TEST_DATA[1].uuid, TEST_DATA[2].uuid]);
    expect(testStoreDataSource.itemsCount).toStrictEqual(97);
});

test('Delete items list by uuid empty uuid', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    testStoreDataSource.deleteItemsListByUuid([TEST_DATA[0].uuid, '', '123', 'uuid']);
    expect(testStoreDataSource.itemsCount).toStrictEqual(99);
});

test('Delete items list by uuid wrong type 1', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    testStoreDataSource.deleteItemsListByUuid([TEST_DATA[0].uuid, 0, 1, 2, undefined, null, '', 'uuid', [], {
        a: 1,
        b: 2
    }]);
    expect(testStoreDataSource.itemsCount).toStrictEqual(99);
});

test('Delete items list by uuid wrong type 2', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    const isDelete: boolean = testStoreDataSource.deleteItemsListByUuid([TEST_DATA[0].uuid, 0, 1, 2, undefined, null, '', 'uuid', [], {
        a: 1,
        b: 2
    }]);
    expect(isDelete).toStrictEqual(false);
});

test('Add new items list 1', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    const newItem1 = GET_TEST_ITEM();
    const newItem2 = GET_TEST_ITEM();
    const newItem3 = GET_TEST_ITEM();
    expect(testStoreDataSource.addNewItemsList([newItem1, newItem2, newItem3])).toStrictEqual([newItem1, newItem2, newItem3]);
});

test('Count items after add new items list', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    const newItem1 = GET_TEST_ITEM();
    const newItem2 = GET_TEST_ITEM();
    const newItem3 = GET_TEST_ITEM();
    testStoreDataSource.addNewItemsList([newItem1, newItem2, newItem3]);
    expect(testStoreDataSource.itemsCount).toStrictEqual(103);
});

test('Add new items list with empty uuid', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    const newItem1: TestDataType = GET_TEST_ITEM();
    const newItem2: TestDataType = GET_TEST_ITEM();
    const newItem3: TestDataType = {
        ...GET_TEST_ITEM(),
        uuid: ''
    };
    testStoreDataSource.addNewItemsList([newItem1, newItem2, newItem3]);
    expect(testStoreDataSource.itemsCount).toStrictEqual(103);
});

test('Add new items list wrong type 1', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    const newItem1: TestDataType = GET_TEST_ITEM();
    const newItem2: TestDataType = GET_TEST_ITEM();
    // @ts-ignore
    testStoreDataSource.addNewItemsList([newItem1, newItem2, 0, 1, 2, undefined, null, '', 'uuid', [], {a: 1, b: 2}]);
    expect(testStoreDataSource.itemsCount).toStrictEqual(103);
});

test('Add new items list wrong type 2', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    const newItem1: TestDataType = GET_TEST_ITEM();
    const newItem2: TestDataType = GET_TEST_ITEM();
    // @ts-ignore
    expect(testStoreDataSource.addNewItemsList([newItem1, newItem2, 0, 1, 2, undefined, null, '', 'uuid', []])).toStrictEqual([newItem1, newItem2]);
});

test('Edit items list 1', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.editItemsList([TEST_DATA[0], TEST_DATA[1], TEST_DATA[2]])).toStrictEqual([TEST_DATA[0], TEST_DATA[1], TEST_DATA[2]]);
});

test('Count items after edit items list', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    testStoreDataSource.editItemsList([TEST_DATA[0], TEST_DATA[1], TEST_DATA[2]])
    expect(testStoreDataSource.itemsCount).toStrictEqual(100);
});

test('Edit items list with empty uuid', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    const editItem1: TestDataType = TEST_DATA[0];
    const editItem2: TestDataType = TEST_DATA[1];
    const editItem3: TestDataType = {
        ...TEST_DATA[2],
        uuid: ''
    };
    const result = testStoreDataSource.editItemsList([editItem1, editItem2, editItem3]);
    expect(result).toStrictEqual([editItem1, editItem2]);
});

test('Edit items list wrong type 1', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    const editItem1: TestDataType = TEST_DATA[0];
    const editItem2: TestDataType = TEST_DATA[1];
    // @ts-ignore
    const result = testStoreDataSource.editItemsList([editItem1, editItem2, 0, 1, 2, undefined, null, '', 'uuid', []]);
    expect(result).toStrictEqual([editItem1, editItem2]);
});

test('Listener addNewItem 1', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA, true);
    const newItem: TestDataType = GET_TEST_ITEM();
    let result: ListenerChangeDataSource<TestDataType> | undefined = undefined;

    testStoreDataSource.addListenerChangeDataSource((param) => {
        result = param;
    });

    testStoreDataSource.addNewItem(newItem);

    expect(result).toStrictEqual({
        changeType: 'addNewItem',
        itemsList: [...TEST_DATA, newItem]
    });
});

test('Listener addNewItem 2', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    const newItem: TestDataType = GET_TEST_ITEM();
    let result: ListenerChangeDataSource<TestDataType> | undefined = undefined;

    testStoreDataSource.addListenerChangeDataSource((param) => {
        result = param;
    });

    testStoreDataSource.addNewItem(newItem, true);
    expect(result).toStrictEqual(undefined);
});

test('Listener deleteItemByUuid 1', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA, true);
    let result: ListenerChangeDataSource<TestDataType> | undefined = undefined;

    testStoreDataSource.addListenerChangeDataSource((param) => {
        result = param;
    });

    testStoreDataSource.deleteItemByUuid(TEST_DATA[0].uuid);

    expect(result).toStrictEqual({
        changeType: 'deleteItem',
        itemsList: TEST_DATA.slice(1)
    });
});

test('Listener deleteItemByUuid 2', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA, true);
    let result: ListenerChangeDataSource<TestDataType> | undefined = undefined;

    testStoreDataSource.addListenerChangeDataSource((param) => {
        result = param;
    });

    testStoreDataSource.deleteItemByUuid(TEST_DATA[0].uuid, true);
    expect(result).toStrictEqual(undefined);
});

test('Listener editItem 1', () => {
    const TEST_DATA = GET_TEST_DATA(5);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA, true);
    let result: ListenerChangeDataSource<TestDataType> | undefined = undefined;

    testStoreDataSource.addListenerChangeDataSource((param) => {
        result = param;
    });

    const editItem: TestDataType = {
        ...TEST_DATA[0],
        fieldDate: new Date(),
        fieldString: 'change text',
        fieldNumber: 100500
    };

    testStoreDataSource.editItem(editItem);

    expect(result).toStrictEqual({
        changeType: 'editItem',
        itemsList: [editItem, ...TEST_DATA.slice(1)]
    });
});

test('Listener editItem 2', () => {
    const TEST_DATA = GET_TEST_DATA(5);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA, true);
    let result: ListenerChangeDataSource<TestDataType> | undefined = undefined;

    testStoreDataSource.addListenerChangeDataSource((param) => {
        result = param;
    });

    const editItem: TestDataType = {
        ...TEST_DATA[0],
        fieldDate: new Date(),
        fieldString: 'change text',
        fieldNumber: 100500
    };

    testStoreDataSource.editItem(editItem, true);

    expect(result).toStrictEqual(undefined);
});

test('Listener setNewDataSource 1', () => {
    let result: ListenerChangeDataSource<TestDataType> | undefined = undefined;

    const TEST_DATA = GET_TEST_DATA(5);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();

    testStoreDataSource.addListenerChangeDataSource((param) => {
        result = param;
    })

    testStoreDataSource.setNewDataSource(TEST_DATA);

    expect(result).toStrictEqual({
        changeType: 'newDataSource',
        itemsList: TEST_DATA
    });
});

test('Listener setNewDataSource 2', () => {
    let result: ListenerChangeDataSource<TestDataType> | undefined = undefined;

    const TEST_DATA = GET_TEST_DATA(5);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();

    testStoreDataSource.addListenerChangeDataSource((param) => {
        result = param;
    });

    testStoreDataSource.setNewDataSource(TEST_DATA, true);
    expect(result).toStrictEqual(undefined);
});

test('Listener removeListenerChangeDataSource 1', () => {
    let result: ListenerChangeDataSource<TestDataType> | undefined = undefined;

    const TEST_DATA = GET_TEST_DATA(5);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();

    const listener = (param: ListenerChangeDataSource<TestDataType>) => {
        result = param;
    };

    testStoreDataSource.addListenerChangeDataSource(listener)
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.removeListenerChangeDataSource(listener)).toStrictEqual(true);
});

test('Listener removeListenerChangeDataSource 2', () => {
    let result: ListenerChangeDataSource<TestDataType> | undefined = undefined;

    const TEST_DATA = GET_TEST_DATA(5);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();

    testStoreDataSource.addListenerChangeDataSource((param) => {
        result = param;
    })
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.removeListenerChangeDataSource((param: ListenerChangeDataSource<TestDataType>) => {
        result = param;
    })).toStrictEqual(false);
});

test('Listener deleteItemsListByUuid 1', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA, true);
    let result: ListenerChangeDataSource<TestDataType> | undefined = undefined;

    testStoreDataSource.addListenerChangeDataSource((param) => {
        result = param;
    });

    testStoreDataSource.deleteItemsListByUuid([TEST_DATA[0].uuid, TEST_DATA[1].uuid, TEST_DATA[2].uuid]);

    expect(result).toStrictEqual({
        changeType: 'deleteItem',
        itemsList: TEST_DATA.slice(3)
    });
});

test('Listener deleteItemsListByUuid 2', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA, true);
    let result: ListenerChangeDataSource<TestDataType> | undefined = undefined;

    testStoreDataSource.addListenerChangeDataSource((param) => {
        result = param;
    });

    testStoreDataSource.deleteItemsListByUuid([TEST_DATA[0].uuid, TEST_DATA[1].uuid, TEST_DATA[2].uuid], true);
    expect(result).toStrictEqual(undefined);
});

test('Listener editItemsList 1', () => {
    const TEST_DATA = GET_TEST_DATA(5);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA, true);
    let result: ListenerChangeDataSource<TestDataType> | undefined = undefined;

    testStoreDataSource.addListenerChangeDataSource((param) => {
        result = param;
    });

    const editItem1: TestDataType = {
        ...TEST_DATA[0],
        fieldDate: new Date(),
        fieldString: 'change text 0',
        fieldNumber: 100500
    };

    const editItem2: TestDataType = {
        ...TEST_DATA[1],
        fieldDate: new Date(),
        fieldString: 'change text 1',
        fieldNumber: 100500
    };

    const editItem3: TestDataType = {
        ...TEST_DATA[2],
        fieldDate: new Date(),
        fieldString: 'change text 2',
        fieldNumber: 100500
    };

    testStoreDataSource.editItemsList([editItem1, editItem2, editItem3]);

    expect(result).toStrictEqual({
        changeType: 'editItem',
        itemsList: [editItem1, editItem2, editItem3, ...TEST_DATA.slice(3)]
    });
});

test('Listener editItemsList 2', () => {
    const TEST_DATA = GET_TEST_DATA(5);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA, true);
    let result: ListenerChangeDataSource<TestDataType> | undefined = undefined;

    testStoreDataSource.addListenerChangeDataSource((param) => {
        result = param;
    });

    const editItem1: TestDataType = {
        ...TEST_DATA[0],
        fieldDate: new Date(),
        fieldString: 'change text 0',
        fieldNumber: 100500
    };

    const editItem2: TestDataType = {
        ...TEST_DATA[1],
        fieldDate: new Date(),
        fieldString: 'change text 1',
        fieldNumber: 100500
    };

    const editItem3: TestDataType = {
        ...TEST_DATA[2],
        fieldDate: new Date(),
        fieldString: 'change text 2',
        fieldNumber: 100500
    };

    testStoreDataSource.editItemsList([editItem1, editItem2, editItem3], true);

    expect(result).toStrictEqual(undefined);
});

test('Listener addNewItemsList 1', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA, true);
    const newItem1: TestDataType = GET_TEST_ITEM();
    const newItem2: TestDataType = GET_TEST_ITEM();
    const newItem3: TestDataType = GET_TEST_ITEM();

    let result: ListenerChangeDataSource<TestDataType> | undefined = undefined;

    testStoreDataSource.addListenerChangeDataSource((param) => {
        result = param;
    });

    testStoreDataSource.addNewItemsList([newItem1, newItem2, newItem3]);

    expect(result).toStrictEqual({
        changeType: 'addNewItem',
        itemsList: [...TEST_DATA, newItem1, newItem2, newItem3]
    });
});

test('Listener addNewItemsList 2', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA, true);
    const newItem1: TestDataType = GET_TEST_ITEM();
    const newItem2: TestDataType = GET_TEST_ITEM();
    const newItem3: TestDataType = GET_TEST_ITEM();

    let result: ListenerChangeDataSource<TestDataType> | undefined = undefined;

    testStoreDataSource.addListenerChangeDataSource((param) => {
        result = param;
    });

    testStoreDataSource.addNewItemsList([newItem1, newItem2, newItem3], true);
    expect(result).toStrictEqual(undefined);
});

test('filter', () => {
    const TEST_DATA = GET_TEST_DATA_STATIC();
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    testStoreDataSource.setFilter((dataList: TestDataType[]) => {
        const result: TestDataType[] = [];

        for (const item of dataList) {
            if (item.fieldBoolean) {
                result.push(item);
            }
        }
        return result;
    });

    expect(testStoreDataSource.itemsList).toStrictEqual([TEST_DATA[0], TEST_DATA[4]]);
});


test('filter', () => {
    const TEST_DATA = GET_TEST_DATA_STATIC();
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    testStoreDataSource.setFilter((dataList: TestDataType[]) => {
        const result: TestDataType[] = [];

        for (const item of dataList) {
            if (item.fieldBoolean) {
                result.push(item);
            }
        }
        return result;
    });

    expect(testStoreDataSource.itemsList).toStrictEqual([TEST_DATA[0], TEST_DATA[4]]);
});

test('remove filter 1', () => {
    const TEST_DATA = GET_TEST_DATA_STATIC();
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    testStoreDataSource.setFilter((dataList: TestDataType[]) => {
        const result: TestDataType[] = [];

        for (const item of dataList) {
            if (item.fieldBoolean) {
                result.push(item);
            }
        }
        return result;
    });

    expect(testStoreDataSource.removeFilter()).toStrictEqual(true);
});

test('remove filter 2', () => {
    const TEST_DATA = GET_TEST_DATA_STATIC();
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.removeFilter()).toStrictEqual(false);
});

test('destroy 1', () => {
    const TEST_DATA = GET_TEST_DATA(10);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    testStoreDataSource.destroy()
    expect(testStoreDataSource.itemsList).toStrictEqual([]);
});

test('destroy 2', () => {
    const TEST_DATA = GET_TEST_DATA(10);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    testStoreDataSource.destroy()
    expect(testStoreDataSource.itemsCount).toStrictEqual(0);
});