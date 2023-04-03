import {AbstractStoreFilters} from "../src/baseStoreFilters";

interface TestDataType {
    readonly a: string;
    readonly b: number;
    readonly c: boolean;
    readonly d: Date | null;
}

function GET_TEST_DATA_STATIC(): TestDataType[] {
    return [
        {
            a: 'Lorem ipsum dolor sit amet, te eum aeque quaestio pertinacia',
            b: 1,
            c: false,
            d: new Date('2023-01-01')
        },
        {
            a: 'Vel volumus singulis adipiscing et. Ne pri quis volutpat pertinacia, his percipit comprehensam ne',
            b: 1,
            c: false,
            d: new Date('2023-01-02')
        },
        {
            a: 'Ius nostrum urbanitas eu, eu nulla impetus quaeque vel, vix ut debitis fierent molestiae. Ne his vitae corrumpit intellegat. Qui id consul disputationi, sit in paulo viris evertitur.',
            b: 2,
            c: true,
            d: new Date('2023-01-03')
        },
        {
            a: 'Luptatum detraxit eos ad, vel at impedit invenire sadipscing. Ea case consequat vim, te alii falli per',
            b: 2,
            c: true,
            d: new Date('2023-01-04')
        },
        {
            a: 'Lorem ipsum dolor sit amet, Ei sed fugit accumsan temporibus, qui libris qualisque no. Ius in inimicus indoctum, no pri mazim latine.',
            b: 3,
            c: false,
            d: new Date('2023-01-05')
        },
        {
            a: 'Ea consul doming cetero est, ubique elaboraret no eam. Mei stet incorrupte cu, qui ei homero deterruisset',
            b: 3,
            c: false,
            d: new Date('2023-01-06')
        },
        {
            a: 'Nec sumo alienum facilisis te, an quo etiam vivendo quaerendum, mea liber salutatus no',
            b: 4,
            c: true,
            d: new Date('2023-01-01')
        },
        {
            a: 'Purto exerci id est. Cum cu deleniti ocurreret, graeci philosophia has ne.',
            b: 4,
            c: true,
            d: null
        },
        {
            a: 'Augue verterem splendide pri et, sea altera scaevola ex, pri at ridens erroribus. Vis aeque vitae id, pri soluta iuvaret civibus et, ea erat porro assueverit usu',
            b: 5,
            c: false,
            d: null
        },
        {
            a: 'Lorem ipsum dolor sit amet, Per at meliore sadipscing omittantur, modus semper meliore sed ea. His inani choro nemore ut, id quod voluptua mei',
            b: 5,
            c: false,
            d: null
        }
    ];
}

class StoreFiltersTest extends AbstractStoreFilters<TestDataType> {

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

    protected _applyFilters(inputItems: TestDataType[]): TestDataType[] {
        return [];
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

    console.log(result);


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

// test('Sort Boolean False True', () => {
//     const storeFilters: StoreFiltersTest = new StoreFiltersTest();
//     const result = storeFilters.applySortBoolean_FalseTrue(GET_TEST_DATA_STATIC());
//
//     expect(result).toStrictEqual(GET_TEST_DATA_STATIC().sort((a, b) => {
//         if (a.c > b.c) {
//             return 1;
//         }
//
//         if (a.c < b.c) {
//             return -1;
//         }
//
//         return 0
//     }));
// });