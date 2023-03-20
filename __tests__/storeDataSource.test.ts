import StoreDataSource, {DataSourceItem} from "../src/storeDataSource";
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

function GET_TEST_ITEM() {
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

test('Items count 0', () => {
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource([]);
    expect(testStoreDataSource.itemsCount).toEqual(0);
});

test('Items count 2', () => {
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(GET_TEST_DATA(2));
    expect(testStoreDataSource.itemsCount).toEqual(2);
});

test('Items count 10', () => {
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(GET_TEST_DATA(10));
    expect(testStoreDataSource.itemsCount).toEqual(10);
});

test('Items count 50', () => {
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(GET_TEST_DATA(50));
    expect(testStoreDataSource.itemsCount).toEqual(50);
});

test('Items count 100', () => {
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(GET_TEST_DATA(100));
    expect(testStoreDataSource.itemsCount).toEqual(100);
});

test('Try get item by uuid 1', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.getItemByUuid(TEST_DATA[0].uuid)).toEqual(TEST_DATA[0]);
});

test('Try get item by uuid 2', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.getItemByUuid(TEST_DATA[10].uuid)).toEqual(TEST_DATA[10]);
});

test('Try get item by uuid 3', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.getItemByUuid(TEST_DATA[30].uuid)).toEqual(TEST_DATA[30]);
});

test('Try get item by uuid 4', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.getItemByUuid(TEST_DATA[26].uuid)).toEqual(TEST_DATA[26]);
});

test('Try get item by uuid 5', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.getItemByUuid(TEST_DATA[50].uuid)).toEqual(TEST_DATA[50]);
});

test('Try get item by uuid 6', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.getItemByUuid(TEST_DATA[99].uuid)).toEqual(TEST_DATA[99]);
});

test('Try get item by uuid 7', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.getItemByUuid(TEST_DATA[80].uuid)).toEqual(TEST_DATA[80]);
});

test('Try get item by uuid empty uuid', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.getItemByUuid('')).toEqual(undefined);
});

test('Try get item by uuid empty uuid', () => {
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    expect(testStoreDataSource.getItemByUuid('')).toEqual(undefined);
});

test('Try get item by uuid wrong type number', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.getItemByUuid(100)).toEqual(undefined);
});

test('Try get item by uuid wrong type Array', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.getItemByUuid([])).toEqual(undefined);
});

test('Try get item by uuid wrong type Object', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.getItemByUuid({a: 1, b: 2})).toEqual(undefined);
});

test('Try get item by uuid wrong type null', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.getItemByUuid(null)).toEqual(undefined);
});

test('Try get item by uuid wrong type undefined', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.getItemByUuid(undefined)).toEqual(undefined);
});

test('clearDataSource 1', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    testStoreDataSource.clearDataSource();
    expect(testStoreDataSource.itemsList).toEqual([]);
});

test('clearDataSource 2', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    testStoreDataSource.clearDataSource();
    expect(testStoreDataSource.itemsCount).toEqual(0);
});

test('Delete item by uuid', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.deleteItemByUuid(TEST_DATA[0].uuid)).toEqual(true);
});

test('Delete item by uuid empty uuid', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.deleteItemByUuid('')).toEqual(false);
});

test('Delete item by uuid not existing uuid', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    expect(testStoreDataSource.deleteItemByUuid('Lorem ipsum dolor sit amet')).toEqual(false);
});

test('Try get removed item by uuid', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    testStoreDataSource.deleteItemByUuid(TEST_DATA[0].uuid);
    expect(testStoreDataSource.getItemByUuid(TEST_DATA[0].uuid)).toEqual(undefined);
});

test('Delete item by uuid wrong type number', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.deleteItemByUuid(100)).toEqual(false);
});

test('Delete item by uuid wrong type Array', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.deleteItemByUuid([])).toEqual(false);
});

test('Delete item by uuid wrong type Object', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.deleteItemByUuid({a: 1, b: 2})).toEqual(false);
});

test('Delete item by uuid wrong type null', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.deleteItemByUuid(null)).toEqual(false);
});

test('Delete item by uuid wrong type undefined', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.deleteItemByUuid(undefined)).toEqual(false);
});

test('Add new item', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    const newItem = GET_TEST_ITEM();
    expect(testStoreDataSource.addNewItem(newItem)).toEqual(newItem);
});

test('Get new item by uuid', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    const newItem = GET_TEST_ITEM();
    testStoreDataSource.addNewItem(newItem)
    expect(testStoreDataSource.getItemByUuid(newItem.uuid)).toEqual(newItem);
});

test('Get new item by uuid wrong type', () => {
    const TEST_DATA = GET_TEST_DATA(100);
    const testStoreDataSource: StoreDataSource<TestDataType> = new StoreDataSource<TestDataType>();
    testStoreDataSource.setNewDataSource(TEST_DATA);
    // @ts-ignore
    expect(testStoreDataSource.addNewItem(0)).toThrow();
});




// test('Items count after add new item', () => {
//     expect(testStoreDataSource.itemsCount).toEqual(100);
// });
//
// test('Try get new item by uuid', () => {
//     expect(testStoreDataSource.getItemByUuid(newItem.uuid)).toEqual(newItem);
// });
//
// const changeItem: TestDataType = {
//     uuid: testStoreDataSource.itemsList[0].uuid,
//     fieldString: 'change',
//     fieldNumber: -100,
//     fieldBoolean: false,
//     fieldDate: new Date(),
//     fieldObject: {
//         a: 1,
//         b: 'Text b',
//         c: false,
//         d: new Date()
//     }
// }
//
//
// test('Edit item', () => {
//     expect(testStoreDataSource.editItem(changeItem)).toEqual(changeItem);
// });

// test('Try get change item by uuid', () => {
//     expect(testStoreDataSource.getItemByUuid(changeItem.uuid)).toEqual(changeItem);
// });