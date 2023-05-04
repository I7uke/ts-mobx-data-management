import StoreDisplayedData from "../src/storeDisplayedData";
import {DataSourceItem} from "../src/storeDataSource";

interface TestDataType extends DataSourceItem {
    readonly a: string;
    readonly b: number;
}

function GET_TEST_DATA(): TestDataType[] {
    return [
        {uuid: '93afeba6-6d13-4bf8-b670-e083be457c5e', a: '0', b: 0}, //1
        {uuid: 'ef952f20-b3b2-463d-b8ee-a0f88c91d227', a: '1', b: 1}, //2
        {uuid: 'caa59895-d356-4433-89e1-a1eb698cf1f1', a: '2', b: 2}, //3
        {uuid: '20e31d0b-47d3-430a-abaf-f81c5582279e', a: '3', b: 3}, //4
        {uuid: 'ac339108-0c9d-406b-97b3-b36da19266bb', a: '4', b: 4}, //5
        {uuid: 'ac77342c-050a-4764-af5b-79b8668d9193', a: '5', b: 5}, //6
        {uuid: 'f6266d74-dd83-44ce-9b12-c3ba8c251dcd', a: '6', b: 6}, //7
        {uuid: '99feabd1-b403-482f-aa40-eb4e0402f5d8', a: '7', b: 7}, //8
        {uuid: '6a79f18d-5899-4f92-8864-f277d047f53c', a: '8', b: 8}, //9
        {uuid: '5aa33293-5a6a-411e-870f-83952bc2889c', a: '9', b: 9}  //10
    ];
}

test('currentPage 1 numberItemsPerPage 2', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 1
    });

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([TEST_DATA[0], TEST_DATA[1]]);
});

test('currentPage 2 numberItemsPerPage 2', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 2
    });

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([TEST_DATA[2], TEST_DATA[3]]);
});

test('currentPage 4 numberItemsPerPage 2', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 4
    });

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([TEST_DATA[6], TEST_DATA[7]]);
});

test('currentPage 2 numberItemsPerPage 3', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 3,
        currentPage: 2
    });

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([TEST_DATA[3], TEST_DATA[4], TEST_DATA[5]]);
});

test('currentPage 4 numberItemsPerPage 3', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 3,
        currentPage: 4
    });

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([TEST_DATA[9]]);
});

test('currentPage 0 numberItemsPerPage 3', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 3,
        currentPage: 0
    });

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([]);
});

test('currentPage -1 numberItemsPerPage 3', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 3,
        currentPage: -1
    });

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([]);
});

test('currentPage 100 numberItemsPerPage 3', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 3,
        currentPage: 100
    });

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([TEST_DATA[9]]);
});

test('currentPage 4 numberItemsPerPage 0', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 0,
        currentPage: 4
    });

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([]);
});

test('currentPage 4 numberItemsPerPage -1', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: -1,
        currentPage: 4
    });

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([]);
});

test('currentPage 4 numberItemsPerPage 100', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 100,
        currentPage: 4
    });

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual(TEST_DATA);
});

test('wrong init data type 1', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
            itemsList: TEST_DATA,
        // @ts-ignore
        numberItemsPerPage: undefined,
        currentPage: 4
    });

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([]);
});

test('wrong init data type 2', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        // @ts-ignore
        currentPage: undefined
    });

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([]);
});

test('wrong init data type 3', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        // @ts-ignore
        numberItemsPerPage: undefined,
        // @ts-ignore
        currentPage: undefined
    });

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([]);
});

test('currentPage 4', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 3,
        currentPage: 4
    });

    expect(storeDataDisplay.currentPage).toStrictEqual(4);
});

test('currentPage -1', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: -1
    });

    expect(storeDataDisplay.currentPage).toStrictEqual(0);
});

test('currentPage 100', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 100
    });

    expect(storeDataDisplay.currentPage).toStrictEqual(5);
});

test('maxPages 5', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 2
    });

    expect(storeDataDisplay.maxPages).toStrictEqual(5);
});

test('maxPages 4', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 3,
        currentPage: 2
    });

    expect(storeDataDisplay.maxPages).toStrictEqual(4);
});

test('maxPages 4', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 5,
        currentPage: 2
    });

    expect(storeDataDisplay.maxPages).toStrictEqual(2);
});

test('availableNumberItemsOnPage Default', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 5,
        currentPage: 2
    });

    expect(storeDataDisplay.availableNumberItemsOnPage).toStrictEqual([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 100]);
});

test('availableNumberItemsOnPage', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 5,
        currentPage: 2,
        availableNumberItemsOnPage: [1,2,3,4,5]
    });

    expect(storeDataDisplay.availableNumberItemsOnPage).toStrictEqual([1,2,3,4,5]);
});

test('numberItemsPerPage', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 5,
        currentPage: 2
    });

    expect(storeDataDisplay.numberItemsPerPage).toStrictEqual(5);
});

test('totalItems', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 5,
        currentPage: 2
    });

    expect(storeDataDisplay.totalItems).toStrictEqual(TEST_DATA.length);
});

test('eventShowNextPage 1', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 4,
        currentPage: 2
    });

    storeDataDisplay.eventShowNextPage();

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([TEST_DATA[8],TEST_DATA[9]]);
});

test('eventShowNextPage 2', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 4,
        currentPage: 2
    });

    storeDataDisplay.eventShowNextPage();

    expect(storeDataDisplay.currentPage).toStrictEqual(3);
});

test('eventShowNextPage 3', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 4,
        currentPage: 2
    });

    storeDataDisplay.eventShowNextPage();
    storeDataDisplay.eventShowNextPage();
    storeDataDisplay.eventShowNextPage();

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([TEST_DATA[8],TEST_DATA[9]]);
});

test('eventShowPrevPage 1', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 4,
        currentPage: 2
    });

    storeDataDisplay.eventShowPrevPage();

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([TEST_DATA[0],TEST_DATA[1], TEST_DATA[2],  TEST_DATA[3]]);
});

test('eventShowPrevPage 2', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 4,
        currentPage: 2
    });

    storeDataDisplay.eventShowPrevPage();

    expect(storeDataDisplay.currentPage).toStrictEqual(1);
});

test('eventShowPrevPage 3', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 4,
        currentPage: 2
    });

    storeDataDisplay.eventShowPrevPage();
    storeDataDisplay.eventShowPrevPage();
    storeDataDisplay.eventShowPrevPage();

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([TEST_DATA[0],TEST_DATA[1], TEST_DATA[2], TEST_DATA[3]]);
});

test('setOptions currentPage', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 3
    });

    storeDataDisplay.setOptions({
        currentPage: 2
    });
    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([TEST_DATA[2], TEST_DATA[3]]);
});

test('setOptions setCurrentPage -1', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 3
    });

    storeDataDisplay.setOptions({
        currentPage: -1
    });
    expect(storeDataDisplay.currentPage).toStrictEqual(0);
});

test('setOptions currentPage wrong type null', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 3
    });

    storeDataDisplay.setOptions({
        // @ts-ignore
        currentPage: null
    });
    expect(storeDataDisplay.currentPage).toStrictEqual(3);
});

test('setOptions currentPage wrong type undefined', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 3
    });

    storeDataDisplay.setOptions({
        // @ts-ignore
        currentPage: undefined
    });
    expect(storeDataDisplay.currentPage).toStrictEqual(3);
});

test('setCurrentPage wrong type string', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 3
    });

    storeDataDisplay.setOptions({
        // @ts-ignore
        currentPage: 'test'
    });
    expect(storeDataDisplay.currentPage).toStrictEqual(3);
});


test('set itemsList', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 3
    });

    storeDataDisplay.setOptions({
        itemsList: TEST_DATA
    });
    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([TEST_DATA[4], TEST_DATA[5]]);
});

test('set itemsList empty', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 3
    });

    storeDataDisplay.setOptions({
        itemsList: []
    });
    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([]);
});

test('set itemsList empty', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 3
    });

    storeDataDisplay.setOptions({
        itemsList: []
    });
    expect(storeDataDisplay.currentPage).toStrictEqual(0);
});

test('setOptions availableNumberItemsOnPage', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 3
    });

    storeDataDisplay.setOptions({
        availableNumberItemsOnPage: [1,2,3]
    });

    expect(storeDataDisplay.availableNumberItemsOnPage).toStrictEqual([1,2,3]);
});


test('setOptions availableNumberItemsOnPage empty', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 3
    });

    storeDataDisplay.setOptions({
        availableNumberItemsOnPage: []
    });

    expect(storeDataDisplay.availableNumberItemsOnPage).toStrictEqual([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 100]);
});

test('setOptions availableNumberItemsOnPage wrong type null', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 3
    });

    storeDataDisplay.setOptions({
        // @ts-ignore
        availableNumberItemsOnPage: null
    });

    expect(storeDataDisplay.availableNumberItemsOnPage).toStrictEqual([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 100]);
});

test('setOptions availableNumberItemsOnPage wrong type undefined', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 3
    });

    storeDataDisplay.setOptions({
        // @ts-ignore
        availableNumberItemsOnPage: undefined
    });

    expect(storeDataDisplay.availableNumberItemsOnPage).toStrictEqual([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 100]);
});

test('setOptions availableNumberItemsOnPage wrong type string', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 3
    });

    storeDataDisplay.setOptions({
        // @ts-ignore
        availableNumberItemsOnPage: 'test'
    });

    expect(storeDataDisplay.availableNumberItemsOnPage).toStrictEqual([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 100]);
});

test('setOptions availableNumberItemsOnPage wrong type', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 3
    });

    storeDataDisplay.setOptions({
        // @ts-ignore
        availableNumberItemsOnPage: [1, 2, 4, 'test', null, NaN, '5', 6, 7]
    });

    expect(storeDataDisplay.availableNumberItemsOnPage).toStrictEqual([1, 2, 4, 6, 7]);
});


test('setOptions numberItemsPerPage', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 3
    });

    storeDataDisplay.setOptions({
        numberItemsPerPage: 2
    });

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([TEST_DATA[4], TEST_DATA[5]]);
});

test('setOptions numberItemsPerPage', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 3
    });

    storeDataDisplay.setOptions({
        numberItemsPerPage: 3
    });

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([TEST_DATA[6], TEST_DATA[7], TEST_DATA[8]]);
});


test('setOptions numberItemsPerPage wrong type null', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 3
    });

    storeDataDisplay.setOptions({
        // @ts-ignore
        numberItemsPerPage: null
    });

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([TEST_DATA[4], TEST_DATA[5]]);
});

test('setOptions numberItemsPerPage wrong type undefined', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 3
    });

    storeDataDisplay.setOptions({
        // @ts-ignore
        numberItemsPerPage: undefined
    });

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([TEST_DATA[4], TEST_DATA[5]]);
});

test('setOptions numberItemsPerPage wrong type string', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 3
    });
    // @ts-ignore
    storeDataDisplay.setOptions({
        // @ts-ignore
        numberItemsPerPage: 'test'
    });

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([TEST_DATA[4], TEST_DATA[5]]);
});


test('dataStatus 1', () => {
    const TEST_DATA = GET_TEST_DATA();

    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 2,
        currentPage: 3
    });

    expect(storeDataDisplay.dataStatus).toStrictEqual('installed');
});

test('dataStatus 2', () => {
    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: [],
        numberItemsPerPage: 2,
        currentPage: 3
    });

    expect(storeDataDisplay.dataStatus).toStrictEqual('notSet');
});

test('dataStatus 3', () => {
    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: [],
        numberItemsPerPage: 2,
        currentPage: 3
    });

    storeDataDisplay.setOptions({
        itemsList:[]
    });

    expect(storeDataDisplay.dataStatus).toStrictEqual('empty');
});

test('setItemsListWithoutTriggers', () => {
    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: [],
        numberItemsPerPage: 2,
        currentPage: 3
    });

    storeDataDisplay.setItemsListWithoutTriggers([]);
    expect(storeDataDisplay.dataStatus).toStrictEqual('notSet');
});


test('setForceUpdate', () => {
    const TEST_DATA = GET_TEST_DATA();
    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: [TEST_DATA[0], TEST_DATA[1]],
        numberItemsPerPage: 1,
        currentPage: 1
    });

    storeDataDisplay.setForceUpdate(() => TEST_DATA);
    storeDataDisplay.eventShowNextPage();
    storeDataDisplay.eventShowNextPage();
    storeDataDisplay.eventShowNextPage();

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([TEST_DATA[3]]);
});

test('setForceUpdate wrong type', () => {
    const TEST_DATA = GET_TEST_DATA();
    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: [TEST_DATA[0], TEST_DATA[1]],
        numberItemsPerPage: 1,
        currentPage: 1
    });

    // @ts-ignore
    storeDataDisplay.setForceUpdate(undefined);
    storeDataDisplay.eventShowNextPage();
    storeDataDisplay.eventShowNextPage();
    storeDataDisplay.eventShowNextPage();

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([TEST_DATA[1]]);
});

test('removeForceUpdate', () => {
    const TEST_DATA = GET_TEST_DATA();
    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: [TEST_DATA[0], TEST_DATA[1]],
        numberItemsPerPage: 1,
        currentPage: 1
    });

    storeDataDisplay.setForceUpdate(() => TEST_DATA);
    storeDataDisplay.removeForceUpdate();
    storeDataDisplay.eventShowNextPage();
    storeDataDisplay.eventShowNextPage();
    storeDataDisplay.eventShowNextPage();

    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([TEST_DATA[1]]);
});

test('destroy 1', () => {
    const TEST_DATA = GET_TEST_DATA();
    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 3,
        currentPage: 1
    });
    storeDataDisplay.destroy();
    expect(storeDataDisplay.dataStatus).toStrictEqual('notSet' );
});

test('destroy 2', () => {
    const TEST_DATA = GET_TEST_DATA();
    const storeDataDisplay: StoreDisplayedData<TestDataType> = new StoreDisplayedData<TestDataType>({
        itemsList: TEST_DATA,
        numberItemsPerPage: 3,
        currentPage: 1
    });

    storeDataDisplay.destroy();
    expect(storeDataDisplay.itemsOnCurrentPage).toStrictEqual([] );
});
