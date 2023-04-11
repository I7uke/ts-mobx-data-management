//
// import AbstractStoreEditItemsPageContent, {
//     InitDataAbstractStoreEditItemsPageContent
// } from "../src/abstractStoreEditItemsPageContent";
// import AbstractStoreFilters from "../src/abstractStoreFilters";
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
//             uuid: '93afeba6-6d13-4bf8-b670-e083be457c5e',
//             a: 'Lorem ipsum dolor sit amet, te eum aeque quaestio pertinacia',
//             b: 1,
//             c: false,
//             d: new Date('2023-01-01'),
//             e: [1, 2, 4],
//             f: ['1', '2', '4'],
//             index: 0,
//         },
//         {//1
//             uuid: 'ef952f20-b3b2-463d-b8ee-a0f88c91d227',
//             a: 'Vel volumus singulis adipiscing et. Ne pri quis volutpat pertinacia, his percipit comprehensam ne',
//             b: 1,
//             c: false,
//             d: new Date('2023-01-02'),
//             e: [4, 5, 6],
//             f: ['4', '5', '6'],
//             index: 1
//         },
//         {//2
//             uuid: '5aa33293-5a6a-411e-870f-83952bc2889c',
//             a: 'Ius nostrum urbanitas eu, eu nulla impetus quaeque vel, vix ut debitis fierent molestiae. Ne his vitae corrumpit intellegat. Qui id consul disputationi, sit in paulo viris evertitur.',
//             b: 2,
//             c: true,
//             d: new Date('2023-01-03'),
//             e: [7, 8, 9],
//             f: ['7', '8', '9'],
//             index: 2
//         },
//         {//3
//             uuid: 'caa59895-d356-4433-89e1-a1eb698cf1f1',
//             a: 'Luptatum detraxit eos ad, vel at impedit invenire sadipscing. Ea case consequat vim, te alii falli per',
//             b: 2,
//             c: true,
//             d: new Date('2023-01-04'),
//             e: [1, 2, 3],
//             f: ['1', '2', '3'],
//             index: 3
//         },
//         {//4
//             uuid: '20e31d0b-47d3-430a-abaf-f81c5582279e',
//             a: 'Lorem ipsum dolor sit amet, Ei sed fugit accumsan temporibus, qui libris qualisque no. Ius in inimicus indoctum, no pri mazim latine.',
//             b: 3,
//             c: false,
//             d: new Date('2023-01-05'),
//             e: [4, 6, 8],
//             f: ['4', '6', '8'],
//             index: 4
//         },
//         {//5
//             uuid: 'ac339108-0c9d-406b-97b3-b36da19266bb',
//             a: 'Ea consul doming cetero est, ubique elaboraret no eam. Mei stet incorrupte cu, qui ei homero deterruisset',
//             b: 3,
//             c: false,
//             d: new Date('2023-01-06'),
//             e: [9, 1, 5],
//             f: ['9', '1', '5'],
//             index: 5
//         },
//         {//6
//             uuid: 'ac77342c-050a-4764-af5b-79b8668d9193',
//             a: 'Nec sumo alienum facilisis te, an quo etiam vivendo quaerendum, mea liber salutatus no',
//             b: 4,
//             c: true,
//             d: new Date('2023-01-01'),
//             e: [2, 5, 8],
//             f: ['2', '5', '8'],
//             index: 6
//         },
//         {//7
//             uuid: 'f6266d74-dd83-44ce-9b12-c3ba8c251dcd',
//             a: 'Purto exerci id est. Cum cu deleniti ocurreret, graeci philosophia has ne.',
//             b: 4,
//             c: true,
//             d: null,
//             e: [7, 8, 9],
//             f: ['7', '8', '9'],
//             index: 7
//         },
//         {//8
//             uuid: '99feabd1-b403-482f-aa40-eb4e0402f5d8',
//             a: 'Augue verterem splendide pri et, sea altera scaevola ex, pri at ridens erroribus. Vis aeque vitae id, pri soluta iuvaret civibus et, ea erat porro assueverit usu',
//             b: 5,
//             c: false,
//             d: null,
//             e: [2, 8, 9],
//             f: ['2', '8', '9'],
//             index: 8
//         },
//         {//9
//             uuid: '6a79f18d-5899-4f92-8864-f277d047f53c',
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
// class StoreFiltersTest extends AbstractStoreFilters<TestDataType> {
//
//
//     protected _applyFilters(inputItems: TestDataType[]): TestDataType[] {
//         return inputItems;
//     }
//
//     constructor() {
//         super();
//     }
// }
//
//
// class TestStoreContent extends AbstractStoreEditItemsPageContent<TestDataType, string> {
//     protected _storeDataSource: StoreDataSource<TestDataType>;
//
//     public storeFilters: StoreFiltersTest;
//
//
//
//
//     protected _validationItem(item: any): TestDataType | undefined {
//         return {
//             uuid: '93afeba6-6d13-4bf8-b670-e083be457c5e',
//             a: 'Lorem ipsum dolor sit amet, te eum aeque quaestio pertinacia',
//             b: 1,
//             c: false,
//             d: new Date('2023-01-01'),
//             e: [1, 2, 4],
//             f: ['1', '2', '4'],
//             index: 0,
//         }
//     }
//
//     protected _eventEditItem(item: TestDataType, isNew: boolean) {
//         this._setStoreEditItem('EditItem');
//     }
//
//     protected _eventDeleteItem(item: TestDataType) {
//
//     }
//
//     protected _eventGetItemInfo(item: TestDataType){}
//
//     protected _serverRequestDeleteItem(item: TestDataType) {
//
//     }
//
//     protected _serverRequestSaveChangedItem(item: TestDataType) {
//
//     }
//
//     protected _serverRequestSaveNewItem(item: TestDataType) {
//         const test = item;
//     }
//
//     public serverRequestGetInitData() {
//         this._storeDataSource.setNewDataSource(GET_TEST_DATA_STATIC());
//     }
//
//     constructor(initData:InitDataAbstractStoreEditItemsPageContent<TestDataType>) {
//         super(initData);
//     }
// }
//
//
