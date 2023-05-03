import BaseStoreFilters from "../src/baseStoreFilters";

type PrimitiveTypes = null | undefined | number | string | boolean;

interface TestDataType {
    readonly a: string;
    readonly b: number;
    readonly c: boolean;
    readonly d: Date | null;
    readonly e: number[];
    readonly f: string[]
    readonly index: number;
}

function GET_TEST_DATA_STATIC(): TestDataType[] {
    return [
        { //0
            a: 'Lorem ipsum dolor sit amet, te eum aeque quaestio pertinacia',
            b: 1,
            c: false,
            d: new Date('2023-01-01'),
            e: [1, 2, 4],
            f: ['1', '2', '4'],
            index: 0,
        },
        {//1
            a: 'Vel volumus singulis adipiscing et. Ne pri quis volutpat pertinacia, his percipit comprehensam ne',
            b: 1,
            c: false,
            d: new Date('2023-01-02'),
            e: [4, 5, 6],
            f: ['4', '5', '6'],
            index: 1
        },
        {//2
            a: 'Ius nostrum urbanitas eu, eu nulla impetus quaeque vel, vix ut debitis fierent molestiae. Ne his vitae corrumpit intellegat. Qui id consul disputationi, sit in paulo viris evertitur.',
            b: 2,
            c: true,
            d: new Date('2023-01-03'),
            e: [7, 8, 9],
            f: ['7', '8', '9'],
            index: 2
        },
        {//3
            a: 'Luptatum detraxit eos ad, vel at impedit invenire sadipscing. Ea case consequat vim, te alii falli per',
            b: 2,
            c: true,
            d: new Date('2023-01-04'),
            e: [1, 2, 3],
            f: ['1', '2', '3'],
            index: 3
        },
        {//4
            a: 'Lorem ipsum dolor sit amet, Ei sed fugit accumsan temporibus, qui libris qualisque no. Ius in inimicus indoctum, no pri mazim latine.',
            b: 3,
            c: false,
            d: new Date('2023-01-05'),
            e: [4, 6, 8],
            f: ['4', '6', '8'],
            index: 4
        },
        {//5
            a: 'Ea consul doming cetero est, ubique elaboraret no eam. Mei stet incorrupte cu, qui ei homero deterruisset',
            b: 3,
            c: false,
            d: new Date('2023-01-06'),
            e: [9, 1, 5],
            f: ['9', '1', '5'],
            index: 5
        },
        {//6
            a: 'Nec sumo alienum facilisis te, an quo etiam vivendo quaerendum, mea liber salutatus no',
            b: 4,
            c: true,
            d: new Date('2023-01-01'),
            e: [2, 5, 8],
            f: ['2', '5', '8'],
            index: 6
        },
        {//7
            a: 'Purto exerci id est. Cum cu deleniti ocurreret, graeci philosophia has ne.',
            b: 4,
            c: true,
            d: null,
            e: [7, 8, 9],
            f: ['7', '8', '9'],
            index: 7
        },
        {//8
            a: 'Augue verterem splendide pri et, sea altera scaevola ex, pri at ridens erroribus. Vis aeque vitae id, pri soluta iuvaret civibus et, ea erat porro assueverit usu',
            b: 5,
            c: false,
            d: null,
            e: [2, 8, 9],
            f: ['2', '8', '9'],
            index: 8
        },
        {//9
            a: 'Lorem ipsum dolor sit amet, Per at meliore sadipscing omittantur, modus semper meliore sed ea. His inani choro nemore ut, id quod voluptua mei',
            b: 5,
            c: false,
            d: null,
            e: [],
            f: [],
            index: 9
        }
    ];
}

class StoreFiltersTest extends BaseStoreFilters<TestDataType> {
    public applySortString_AZ(inputItems: TestDataType[]) {
        return this._sortString_AZ(inputItems, 'a');
    }

    public applySortString_ZA(inputItems: TestDataType[]) {
        return this._sortString_ZA(inputItems, 'a');
    }

    public applySortNumber_09(inputItems: TestDataType[]) {
        return this._sortNumber_09(inputItems, 'b');
    }

    public applySortNumber_90(inputItems: TestDataType[]) {
        return this._sortNumber_90(inputItems, 'b');
    }

    public applySortBoolean_FalseTrue(inputItems: TestDataType[]) {
        return this._sortBoolean_FalseTrue(inputItems, 'c');
    }

    public applySortBoolean_TrueFalse(inputItems: TestDataType[]) {
        return this._sortBoolean_TrueFalse(inputItems, 'c');
    }

    public applySortDate_09(inputItems: TestDataType[]) {
        return this._sortDate_09(inputItems, 'd');
    }

    public applySortDate_90(inputItems: TestDataType[]) {
        return this._sortDate_90(inputItems, 'd');
    }

    public searchString(inputItems: TestDataType[], searchQuery: string) {
        return this._searchString({
            itemsList: inputItems,
            searchQuery: searchQuery,
            fieldsNames: ['a']
        });
    }

    public filterArrayFieldByArrayValues(inputItems: TestDataType[], searchValuesList: PrimitiveTypes[]) {
        return this._filterArrayFieldByArrayValues({
            fieldsNames: ['f', 'e'],
            itemsList: inputItems,
            searchValuesList: searchValuesList,
        });
    }

    public filterByValuesList(inputItems: TestDataType[], searchValuesList: PrimitiveTypes[]) {
        return this._filterByValuesList({
            fieldsNames: ['a', 'b', 'c'],
            itemsList: inputItems,
            searchValuesList: searchValuesList
        });
    }

    public filterByValue(inputItems: TestDataType[], searchValue: PrimitiveTypes) {
        return this._filterByValue({
            itemsList: inputItems,
            searchValue: searchValue,
            fieldsNames: ['a', 'b', 'c']
        });
    }

    private _applyTestSearchString(inputItems: TestDataType[]) {

        return this._searchString({
            itemsList: inputItems,
            searchQuery: 'Lorem ipsum dolor sit amet',
            fieldsNames: ['a']
        });

    }

    protected _applyFiltersOverride(inputItems: TestDataType[]): TestDataType[] {
        return this._applyFiltersInOrder(inputItems, [
            this.applySortString_AZ,
            this._applyTestSearchString
        ]);
    }

    constructor() {
        super();
        this.applySortString_AZ = this.applySortString_AZ.bind(this);
        this._applyTestSearchString = this._applyTestSearchString.bind(this);
    }
}

test('Sort string A-Z', () => {

    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.applySortString_AZ(GET_TEST_DATA_STATIC());

    expect(result).toStrictEqual(GET_TEST_DATA_STATIC().sort((a, b) => {
        if (a.a > b.a) {
            return 1;
        }

        if (a.a < b.a) {
            return -1;
        }

        return 0
    }));
});

test('Sort string Z-A', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.applySortString_ZA(GET_TEST_DATA_STATIC());

    expect(result).toStrictEqual(GET_TEST_DATA_STATIC().sort((a, b) => {
        if (a.a > b.a) {
            return -1;
        }

        if (a.a < b.a) {
            return 1;
        }

        return 0
    }));
});

test('Sort number 9-0', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.applySortNumber_90(GET_TEST_DATA_STATIC());
    expect(result).toStrictEqual(GET_TEST_DATA_STATIC().sort((a, b) => {
        if (a.b > b.b) {
            return -1;
        }

        if (a.b < b.b) {
            return 1;
        }

        return 0
    }));
});

test('Sort number 0-9', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.applySortNumber_09(GET_TEST_DATA_STATIC());

    expect(result).toStrictEqual(GET_TEST_DATA_STATIC().sort((a, b) => {
        if (a.b > b.b) {
            return 1;
        }

        if (a.b < b.b) {
            return 0;
        }

        return 0
    }));
});

test('Sort Boolean True False', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.applySortBoolean_TrueFalse(GET_TEST_DATA_STATIC());
    expect(result).toStrictEqual(GET_TEST_DATA_STATIC().sort((a, b) => {
        if (a.c > b.c) {
            return -1;
        }

        if (a.c < b.c) {
            return 1;
        }

        return 0
    }));
});

test('Sort Boolean False True', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.applySortBoolean_FalseTrue(GET_TEST_DATA_STATIC());

    expect(result).toStrictEqual(GET_TEST_DATA_STATIC().sort((a, b) => {
        if (a.c > b.c) {
            return 1;
        }

        if (a.c < b.c) {
            return -1;
        }

        return 0
    }));
});

test('Sort Sort Date 0-9', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.applySortDate_09(GET_TEST_DATA_STATIC());
    const testData = GET_TEST_DATA_STATIC();

    expect(result).toStrictEqual([
        testData[0],
        testData[6],
        testData[1],
        testData[2],
        testData[3],
        testData[4],
        testData[5],
        testData[7],
        testData[8],
        testData[9],
    ]);
});

test('Sort Sort Date 9-0', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.applySortDate_90(GET_TEST_DATA_STATIC());
    const testData = GET_TEST_DATA_STATIC();

    expect(result).toStrictEqual([
        testData[5],
        testData[4],
        testData[3],
        testData[2],
        testData[1],
        testData[0],
        testData[6],
        testData[7],
        testData[8],
        testData[9],
    ]);
});

test('Search string', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.searchString(GET_TEST_DATA_STATIC(), 'Lorem ipsum dolor sit amet');
    const testData = GET_TEST_DATA_STATIC();

    expect(result).toStrictEqual([
        testData[0],
        testData[4],
        testData[9],
    ]);
});

test('Search string empty', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.searchString(GET_TEST_DATA_STATIC(), '');
    const testData = GET_TEST_DATA_STATIC();
    expect(result).toStrictEqual(testData);
});

test('filterArrayFieldByArrayValues numbers', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.filterArrayFieldByArrayValues(GET_TEST_DATA_STATIC(), [1, 2, 3]);
    const testData = GET_TEST_DATA_STATIC();

    expect(result).toStrictEqual([
        testData[0],
        testData[3],
        testData[5],
        testData[6],
        testData[8],
    ]);
});

test('filterArrayFieldByArrayValues string', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.filterArrayFieldByArrayValues(GET_TEST_DATA_STATIC(), ['1', '2', '3']);
    const testData = GET_TEST_DATA_STATIC();

    expect(result).toStrictEqual([
        testData[0],
        testData[3],
        testData[5],
        testData[6],
        testData[8],
    ]);
});

test('filterArrayFieldByArrayValues string | numbers', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.filterArrayFieldByArrayValues(GET_TEST_DATA_STATIC(), ['1', '2', '3', 1, 2, 3]);
    const testData = GET_TEST_DATA_STATIC();

    expect(result).toStrictEqual([
        testData[0],
        testData[3],
        testData[5],
        testData[6],
        testData[8],
    ]);
});

test('filterArrayFieldByArrayValues string | numbers', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.filterArrayFieldByArrayValues(GET_TEST_DATA_STATIC(), ['1', '2', '3', 1, 2, 3, 5]);
    const testData = GET_TEST_DATA_STATIC();
    expect(result).toStrictEqual([
        testData[0],
        testData[1],
        testData[3],
        testData[5],
        testData[6],
        testData[8],
    ]);
});

test('filterArrayFieldByArrayValues empty', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.filterArrayFieldByArrayValues(GET_TEST_DATA_STATIC(), []);
    const testData = GET_TEST_DATA_STATIC();
    expect(result).toStrictEqual(testData);
});

test('filterByValuesList number', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.filterByValuesList(GET_TEST_DATA_STATIC(), [1, 2, 3]);
    const testData = GET_TEST_DATA_STATIC();
    expect(result).toStrictEqual([
        testData[0],
        testData[1],
        testData[2],
        testData[3],
        testData[4],
        testData[5],
    ]);
});

test('filterByValuesList number | string', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.filterByValuesList(GET_TEST_DATA_STATIC(), [1, 2, 3, 'Lorem ipsum dolor sit amet, Per at meliore sadipscing omittantur, modus semper meliore sed ea. His inani choro nemore ut, id quod voluptua mei']);
    const testData = GET_TEST_DATA_STATIC();
    expect(result).toStrictEqual([
        testData[0],
        testData[1],
        testData[2],
        testData[3],
        testData[4],
        testData[5],
        testData[9],
    ]);
});

test('filterByValuesList number | string | boolean', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.filterByValuesList(GET_TEST_DATA_STATIC(), [1, 2, true, 'Lorem ipsum dolor sit amet, Per at meliore sadipscing omittantur, modus semper meliore sed ea. His inani choro nemore ut, id quod voluptua mei']);
    const testData = GET_TEST_DATA_STATIC();

    expect(result).toStrictEqual([
        testData[0],
        testData[1],
        testData[2],
        testData[3],
        testData[6],
        testData[7],
        testData[9],
    ]);
});

test('filterByValue number', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.filterByValue(GET_TEST_DATA_STATIC(), 1);
    const testData = GET_TEST_DATA_STATIC();

    expect(result).toStrictEqual([
        testData[0],
        testData[1]
    ]);
});

test('filterByValue number', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.filterByValue(GET_TEST_DATA_STATIC(), 5);
    const testData = GET_TEST_DATA_STATIC();

    expect(result).toStrictEqual([
        testData[8],
        testData[9]
    ]);
});

test('filterByValue number not found', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.filterByValue(GET_TEST_DATA_STATIC(), 100);

    expect(result).toStrictEqual([]);
});

test('filterByValue string not found', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.filterByValue(GET_TEST_DATA_STATIC(), 'string value');

    expect(result).toStrictEqual([]);
});

test('filterByValue string', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.filterByValue(GET_TEST_DATA_STATIC(), 'Lorem ipsum dolor sit amet, Per at meliore sadipscing omittantur, modus semper meliore sed ea. His inani choro nemore ut, id quod voluptua mei');
    const testData = GET_TEST_DATA_STATIC();

    expect(result).toStrictEqual([
        testData[9]
    ]);
});

test('filterByValue boolean true', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.filterByValue(GET_TEST_DATA_STATIC(), true);
    const testData = GET_TEST_DATA_STATIC();

    expect(result).toStrictEqual([
        testData[2],
        testData[3],
        testData[6],
        testData[7],
    ]);
});

test('filterByValue boolean false', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.filterByValue(GET_TEST_DATA_STATIC(), false);
    const testData = GET_TEST_DATA_STATIC();

    expect(result).toStrictEqual([
        testData[0],
        testData[1],
        testData[4],
        testData[5],
        testData[8],
        testData[9],
    ]);
});

test('applyFilters', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();
    const result = storeFilters.applyFilters(GET_TEST_DATA_STATIC());
    const testData = GET_TEST_DATA_STATIC();

    expect(result).toStrictEqual([
        testData[4],
        testData[9],
        testData[0],
    ]);
});

test('setCallbackUpdateViewData', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();

    let result: boolean = false;
    storeFilters.setCallbackUpdateViewData(() => {
        result = true;
    });

    storeFilters.eventUpdateViewData();
    expect(result).toStrictEqual(true);
});

test('removeCallbackUpdateViewData', () => {
    const storeFilters: StoreFiltersTest = new StoreFiltersTest();

    let result: boolean = false;
    storeFilters.setCallbackUpdateViewData(() => {
        result = true;
    });
    storeFilters.removeCallbackUpdateViewData()
    storeFilters.eventUpdateViewData();
    expect(result).toStrictEqual(false);
});
