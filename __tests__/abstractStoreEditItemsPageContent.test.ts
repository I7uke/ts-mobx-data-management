// import AbstractStoreEditItemsPageContent, {
//     InitDataAbstractStoreEditItemsPageContent
// } from "../src/baseStoreAdminPageContent";
// import StoreDataSource, {DataSourceItem} from "../src/storeDataSource";
//
// interface TestDataType extends DataSourceItem{
//     readonly a: string;
//     readonly b: number;
//     readonly c: boolean;
//     readonly d: Date | null;
//     readonly e: number[];
//     readonly f: string[]
//     readonly index: number;
// }
//
// function GET_TEST_DATA_STATIC(): TestDataType[] {
//     return [
//         { //0
//             a: 'Lorem ipsum dolor sit amet, te eum aeque quaestio pertinacia',
//             b: 1,
//             c: false,
//             d: new Date('2023-01-01'),
//             e: [1, 2, 4],
//             f: ['1', '2', '4'],
//             index: 0,
//         },
//         {//1
//             a: 'Vel volumus singulis adipiscing et. Ne pri quis volutpat pertinacia, his percipit comprehensam ne',
//             b: 1,
//             c: false,
//             d: new Date('2023-01-02'),
//             e: [4, 5, 6],
//             f: ['4', '5', '6'],
//             index: 1
//         },
//         {//2
//             a: 'Ius nostrum urbanitas eu, eu nulla impetus quaeque vel, vix ut debitis fierent molestiae. Ne his vitae corrumpit intellegat. Qui id consul disputationi, sit in paulo viris evertitur.',
//             b: 2,
//             c: true,
//             d: new Date('2023-01-03'),
//             e: [7, 8, 9],
//             f: ['7', '8', '9'],
//             index: 2
//         },
//         {//3
//             a: 'Luptatum detraxit eos ad, vel at impedit invenire sadipscing. Ea case consequat vim, te alii falli per',
//             b: 2,
//             c: true,
//             d: new Date('2023-01-04'),
//             e: [1, 2, 3],
//             f: ['1', '2', '3'],
//             index: 3
//         },
//         {//4
//             a: 'Lorem ipsum dolor sit amet, Ei sed fugit accumsan temporibus, qui libris qualisque no. Ius in inimicus indoctum, no pri mazim latine.',
//             b: 3,
//             c: false,
//             d: new Date('2023-01-05'),
//             e: [4, 6, 8],
//             f: ['4', '6', '8'],
//             index: 4
//         },
//         {//5
//             a: 'Ea consul doming cetero est, ubique elaboraret no eam. Mei stet incorrupte cu, qui ei homero deterruisset',
//             b: 3,
//             c: false,
//             d: new Date('2023-01-06'),
//             e: [9, 1, 5],
//             f: ['9', '1', '5'],
//             index: 5
//         },
//         {//6
//             a: 'Nec sumo alienum facilisis te, an quo etiam vivendo quaerendum, mea liber salutatus no',
//             b: 4,
//             c: true,
//             d: new Date('2023-01-01'),
//             e: [2, 5, 8],
//             f: ['2', '5', '8'],
//             index: 6
//         },
//         {//7
//             a: 'Purto exerci id est. Cum cu deleniti ocurreret, graeci philosophia has ne.',
//             b: 4,
//             c: true,
//             d: null,
//             e: [7, 8, 9],
//             f: ['7', '8', '9'],
//             index: 7
//         },
//         {//8
//             a: 'Augue verterem splendide pri et, sea altera scaevola ex, pri at ridens erroribus. Vis aeque vitae id, pri soluta iuvaret civibus et, ea erat porro assueverit usu',
//             b: 5,
//             c: false,
//             d: null,
//             e: [2, 8, 9],
//             f: ['2', '8', '9'],
//             index: 8
//         },
//         {//9
//             a: 'Lorem ipsum dolor sit amet, Per at meliore sadipscing omittantur, modus semper meliore sed ea. His inani choro nemore ut, id quod voluptua mei',
//             b: 5,
//             c: false,
//             d: null,
//             e: [],
//             f: [],
//             index: 9
//         }
//     ];
// }
//
//
// class Test extends AbstractStoreEditItemsPageContent<TestDataType> {
//
//     protected _storeDataSource: StoreDataSource<TestDataType, string>
//
//
//     constructor(initData:InitDataAbstractStoreEditItemsPageContent<TestDataType>) {
//         super(initData);
//
//         this._storeDataSource = ''
//     }
// }