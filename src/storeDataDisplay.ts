import {action, computed, makeObservable, observable} from "mobx";
import StoreDataSource, {DataSourceItem} from "./storeDataSource";

type Pagination<TItem extends DataSourceItem> = {
    /**
     * Максимальное количество доступных страниц
     */
    readonly maxPages: number;
    /**
     * Общее количество элементов
     */
    readonly totalItems: number;
    /**
     * Количество элементов на одной странице
     */
    readonly itemsOnPage: number;
    /**
     * Текущая страница
     */
    readonly currentPage: number;
    /**
     * Элементы на текущей странице
     */
    readonly itemsOnCurrentPage: TItem[];
    /**
     * Возможные колличества элементов на странице
     */
    readonly availableNumberItemsOnPage: number[];
}

//region Получить значения по умолчанию
function getDefaultAvailableNumberItemsOnPage(): number[] {
    return [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 100];
}


function getEmptyPagination<TItem extends DataSourceItem>(): Pagination<TItem> {
    return {
        itemsOnPage: 0,
        maxPages: 0,
        totalItems: 0,
        currentPage: 0,
        itemsOnCurrentPage: [],
        availableNumberItemsOnPage: getDefaultAvailableNumberItemsOnPage()
    }
}
//endregion

//region Проверки
function validationAvailableNumberItemsOnPage(numList?: number[] | null): number[] {

    if (!Array.isArray(numList)) {
        return getDefaultAvailableNumberItemsOnPage();
    }

    if (!numList.length) {
        return getDefaultAvailableNumberItemsOnPage();
    }

    const result: number[] = [];

    for (const num of numList) {
        if (typeof num !== 'number') {
            continue;
        }

        if (isNaN(num)) {
            continue;
        }

        const integer = Math.trunc(num);

        if (!integer) {
            continue;
        }

        if (integer <= 0) {
            continue;
        }

        result.push(num);
    }

    if (!result.length) {
        return getDefaultAvailableNumberItemsOnPage();
    }

    return result;

}

function validationDefaultValueNumber(num: number | undefined | null): number {
    if (typeof num !== 'number') {
        return 0;
    }

    if (isNaN(num)) {
        return 0;
    }

    const integer = Math.trunc(num);

    if(integer < 0){
        return 0;
    }

    return integer;
}

type ValidationNumberParam = {
    readonly valueForValidation: number | null | undefined;
    readonly defaultValue?: number;
}

/**
 * Проверить число
 * @param inputOptions
 */
 function validationNumber(param: ValidationNumberParam): number {

    if (typeof param.valueForValidation !== 'number') {
        return validationDefaultValueNumber(param.defaultValue);
    }

    if (isNaN(param.valueForValidation)) {
        return validationDefaultValueNumber(param.defaultValue);
    }

    const integer = Math.trunc(param.valueForValidation);

    if (integer < 0) {
        return validationDefaultValueNumber(param.defaultValue);
    }

    return integer;

}
//endregion

//region Максимальное количество страниц
type CountMaxPagesParams = {
    /**
     * Количество элементов на одной странице
     */
    readonly itemsOnPage: number;
    /**
     * Общее количество страниц
     */
    readonly totalItems: number;
}

function countMaxPages(params: CountMaxPagesParams): number {
    const totalItems: number = validationNumber({
        valueForValidation: params.totalItems,
        defaultValue: 0
    });

    const itemsOnPage: number = validationNumber({
        valueForValidation: params.itemsOnPage,
        defaultValue: 0
    });

    if (!totalItems) {
        return 0;
    }

    if (itemsOnPage === 0) {
        return 0;
    }

    const remainder: number = totalItems % itemsOnPage;

    if (remainder === 0) {
        return totalItems / itemsOnPage;
    }

    return (Math.trunc(totalItems / itemsOnPage)) + 1
}

//endregion

//region Проверка текущей страницы
type ValidationCurrentPageParams = {
    readonly maxPages: number;
    readonly currentPage: number;
}

function validationCurrentPage(params: ValidationCurrentPageParams): number {
    const maxPages: number = validationNumber({
        valueForValidation: params.maxPages,
        defaultValue: 0
    });

    if (!maxPages) {
        return 0;
    }

    const currentPage: number = validationNumber({
        valueForValidation: params.currentPage,
        defaultValue: 0
    });

    if (!currentPage) {
        return 0;
    }

    if (currentPage > maxPages) {
        return maxPages;
    }

    return currentPage;
}
//endregion

//region Получить пагинацию
type GetPaginationParams<TItem extends DataSourceItem> = {
    /**
     * Количество элементов на одной странице
     */
    readonly itemsOnPage: number;
    /**
     * Текущая страница
     */
    readonly currentPage: number;
    /**
     * Список всех элементов
     */
    readonly allItemsList: TItem[];
    /**
     * Возможные колличества элементов на странице
     */
    readonly availableNumberItemsOnPage: number[];
}

function getPagination<TItem extends DataSourceItem>(params: GetPaginationParams<TItem>): Pagination<TItem> {
    const totalItems: number = validationNumber({
        valueForValidation: params.allItemsList.length,
        defaultValue: 0
    });

    if (!totalItems) {
        return getEmptyPagination();
    }

    const itemsOnPage: number = validationNumber({
        valueForValidation: params.itemsOnPage,
        defaultValue: 0
    });

    if (!itemsOnPage) {
        return getEmptyPagination();
    }

    const maxPages: number = countMaxPages({
        totalItems: totalItems,
        itemsOnPage: itemsOnPage
    });

    if (!maxPages) {
        return getEmptyPagination();
    }

    const currentPage: number = validationCurrentPage({
        currentPage: params.currentPage,
        maxPages: maxPages
    });

    if (!currentPage) {
        return getEmptyPagination();
    }


    // Не включая
    let endIndex: number = currentPage * itemsOnPage;

    if(endIndex > params.allItemsList.length){
        endIndex = params.allItemsList.length;
    }

    // Включая
    let startIndex: number = endIndex - itemsOnPage;

    if(startIndex < 0){
        startIndex = 0;
    }

    const itemsOnCurrentPage = params.allItemsList.slice(startIndex, endIndex);

    return {
        maxPages: maxPages,
        totalItems: totalItems,
        itemsOnPage: itemsOnPage,
        currentPage: currentPage,
        availableNumberItemsOnPage: validationAvailableNumberItemsOnPage(params.availableNumberItemsOnPage),
        itemsOnCurrentPage: itemsOnCurrentPage
    }
}

//endregion


type InitStoreDataDisplay<TItem extends DataSourceItem> = {
    /**
     * Источник данных
     */
    readonly dataSource: StoreDataSource<TItem>;
    /**
     * Возможные колличества элементов на странице
     */
    readonly availableNumberItemsOnPage?: number[];
    /**
     * Количество элементов на одной странице
     */
    readonly itemsOnPage?: number;
    /**
     * Текущая страница
     */
    readonly currentPage?: number;
}

export default class StoreDataDisplay<TItem extends DataSourceItem> {
    private _dataSource: StoreDataSource<TItem>;
    private _itemsList: TItem[];
    private _pagination_observable: Pagination<TItem>;


    private _setPagination_action(pagination: Pagination<TItem>){
        this._pagination_observable = pagination;
    }

    /**
     * Элементы на текущей странице
     */
    get itemsOnCurrentPage(): TItem[]{
        return this._pagination_observable.itemsOnCurrentPage;
    }

    /**
     * Текущая страница
     */
    get currentPage(): number{
        return this._pagination_observable.currentPage;
    }

    /**
     * Установить текущую страницу
     * @param page
     */
    public setCurrentPage(page: number){
        const validCurrentPage: number = validationCurrentPage({
            currentPage: page,
            maxPages: this._pagination_observable.currentPage
        });

        if(!validCurrentPage) {
            return;
        }

        const newPagination = getPagination({
            currentPage: validCurrentPage,
            availableNumberItemsOnPage: this._pagination_observable.availableNumberItemsOnPage,
            itemsOnPage: this._pagination_observable.itemsOnPage,
            allItemsList: this._itemsList
        });

        this._setPagination_action(newPagination);
    }

    /**
     * Возможные колличества элементов на странице
     */
    get availableNumberItemsOnPage(): number[]{
        return this._pagination_observable.availableNumberItemsOnPage;
    }

    /**
     * Установить массив возможного колличества элементов на странице
     * @param itemsOnPage
     */
    public setAvailableNumberItemsOnPage(itemsOnPage: number[]){
        const newPagination = getPagination({
            currentPage: this._pagination_observable.currentPage,
            availableNumberItemsOnPage: validationAvailableNumberItemsOnPage(itemsOnPage),
            itemsOnPage: this._pagination_observable.itemsOnPage,
            allItemsList: this._itemsList
        });

        this._setPagination_action(newPagination);
    }

    /**
     * Максимальное количество доступных страниц
     */
    get maxPages(): number {
        return this._pagination_observable.maxPages;
    }

    /**
     * Количество элементов на одной странице
     */
    get itemsOnPage(): number {
        return this._pagination_observable.itemsOnPage;
    }


    /**
     * Установить количество элементов на одной странице
     * @param itemsOnPage
     */
    public setItemsOnPage(itemsOnPage: number){
        const validItemsOnPage = validationNumber({
            valueForValidation: itemsOnPage,
            defaultValue: 0
        });

        if(!validItemsOnPage) {
            return;
        }

        const newPagination = getPagination({
            currentPage: this._pagination_observable.currentPage,
            availableNumberItemsOnPage: this._pagination_observable.availableNumberItemsOnPage,
            itemsOnPage: validItemsOnPage,
            allItemsList: this._itemsList
        });

        this._setPagination_action(newPagination);
    }

    /**
     * Общее количество элементов
     */
    get totalItems(): number {
        return this._pagination_observable.totalItems;
    }

    constructor(init: InitStoreDataDisplay<TItem>) {
        this._dataSource = init.dataSource;
        this._itemsList = init.dataSource.itemsList;

        const availableNumberItemsOnPage: number[] = validationAvailableNumberItemsOnPage(init.availableNumberItemsOnPage)

        this._pagination_observable = getPagination({
            availableNumberItemsOnPage: availableNumberItemsOnPage,
            itemsOnPage: validationNumber({
                valueForValidation: init.itemsOnPage,
                defaultValue: availableNumberItemsOnPage[0]
            }),
            currentPage: validationNumber({
                valueForValidation: init.currentPage,
                defaultValue: 1
            }),
            allItemsList: this._itemsList
        });

        makeObservable<this,
            '_pagination_observable' |
            '_setPagination_action'>(this, {
            _pagination_observable: observable.ref,
            _setPagination_action: action,
            itemsOnCurrentPage: computed,
            currentPage: computed,
            availableNumberItemsOnPage: computed,
            maxPages:computed,
            itemsOnPage: computed,
            totalItems: computed
        });
    }
}


//
//
// interface GetListPaginationOptions {
//     // Максимальное число страниц
//     maxPagesNumber: number;
// }
//
// interface CountMaxPagesOptions {
//     totalItemsNumber: number;
//     itemsOnPageNumber: number;
// }
//
// interface PaginationSelectedData {
//     // Выбранная текущая страница
//     selectedCurrentPage: DropdownSelectItem;
//     // Выбранное количество элементов на странице
//     selectedItemsOnPage: DropdownSelectItem;
// }
//
// interface AuxiliaryData {
//     // Максимальное число страниц
//     maxPagesNumber: number;
//     // Всего элементов
//     totalItemsCount: number;
//     // Список страниц пагинации
//     listPages: DropdownSelectItem[];
//     // Список возможного разбиения элементов
//     listItemsOnPage: DropdownSelectItem[];
// }
//
// interface GetItemsForPageOptions<DataItem extends DataWithUuid> {
//     // Выбранный номер текущей страницы
//     selectedCurrentPageNumber: number;
//     // Выбранное текущее количество элементов на странице
//     selectedItemsOnPageNumber: number;
//     // Данные для пагинации
//     dataListForPagination: DataItem[];
// }
//
// interface UpdateCurrentDataOptions<DataItem extends DataWithUuid> {
//     //Сбросить текущее количество элементов на странице
//     isResetSelectedItemsOnPage: boolean;
//     // Сбросить текущую выбранную страницу
//     isResetSelectedCurrentPage: boolean;
//     // Данные для пагинации
//     dataListForPagination: DataItem[];
// }
//
// interface CheckPageNumberOptions {
//     pageNumber: number;
//     maxPagesNumber: number;
// }
//
// interface TrySaveCurrentPageOptions {
//     // Список страниц
//     listPages: DropdownSelectItem[];
//     // Выбранная текущая страница
//     selectedCurrentPage: DropdownSelectItem;
// }
//
//

//
//
// export class StoreDataPagination<DataItem extends DataWithUuid> {
//
//     /**
//      * Получить пустой элемент пагинации
//      * @private
//      */
//     private _getEmptyPaginationItem(): DropdownSelectItem {
//         return {
//             value: 0,
//             label: '0'
//         }
//     }
//
//     //region Вспомогательные данные
//     private _auxiliaryData_observable?: AuxiliaryData;
//
//     /**
//      * Получить вспомогательные данные
//      */
//     get auxiliaryData() {
//         return this._auxiliaryData_observable;
//     }
//
//     //endregion
//
//     /**
//      * Редактировать существующий элемент, создает КОПИЮ и редактирует ее
//      * Вернет true если элемент удалось изменить
//      * @param item
//      */
//     public editExistingItem(item: DataItem): DataItem | undefined {
//         const copyEditItem: DataItem = Object.assign({}, item);
//         for (let i = 0; i < this._dataListForPagination.length; ++i) {
//             if (this._dataListForPagination[i].uuid === copyEditItem.uuid) {
//                 this._dataListForPagination[i] = copyEditItem;
//                 return copyEditItem;
//             }
//         }
//         return undefined;
//     }
//
//     //region Общий набор данных
//     private _dataListForPagination: DataItem[];
//
//     public setNewDataListForPagination(dataList: DataItem[], inputSelectedItemsOnPage?: number) {
//         if (!dataList.length) {
//             // Данные пустые, нечего показывать
//             this.resetStoreData();
//             return;
//         }
//
//         // Запоминаем набор данных
//         this._dataListForPagination = dataList;
//         // Общее количество элементов
//         const totalItemsCount = this._dataListForPagination.length;
//         // Получаем список возможного отображения элементов на странице
//         const listItemsOnPage = this._getListItemsOnPage();
//         // Текущее выбранное значение элементов на странице
//         const selectedItemsOnPage: DropdownSelectItem = inputSelectedItemsOnPage ? this._createListItemOnPage(inputSelectedItemsOnPage) : Object.assign({}, listItemsOnPage[0]);
//         // Максимальное количество страниц
//         const maxPagesNumber = this._countMaxPages({
//             itemsOnPageNumber: selectedItemsOnPage.value,
//             totalItemsNumber: totalItemsCount
//         });
//         // Получаем список страниц пагинации
//         const listPages = this._getListPagination({
//             maxPagesNumber: maxPagesNumber
//         });
//         //Текущая выбранная страница
//         const selectedCurrentPage: DropdownSelectItem = Object.assign({}, listPages[0]);
//         //Запоминаем вспомогательные данные
//         this._auxiliaryData_observable = {
//             maxPagesNumber: maxPagesNumber,
//             listItemsOnPage: listItemsOnPage,
//             listPages: listPages,
//             totalItemsCount: totalItemsCount
//         };
//
//         // Устанавливаем выбранные данные
//         this._paginationSelectedData_observable = {
//             selectedItemsOnPage: selectedItemsOnPage,
//             selectedCurrentPage: selectedCurrentPage
//         };
//         // Устанавливаем данные на текущей странице
//         this._dataOnCurrentPage_observable = this._getItemsForPage({
//             selectedCurrentPageNumber: selectedCurrentPage.value,
//             selectedItemsOnPageNumber: selectedItemsOnPage.value,
//             dataListForPagination: this._dataListForPagination
//         });
//     }
//
//     public updateCurrentDataPagination(options: UpdateCurrentDataOptions<DataItem>) {
//         const {isResetSelectedItemsOnPage, isResetSelectedCurrentPage, dataListForPagination} = options;
//         if (!dataListForPagination.length) {
//             // Данные пустые, нечего показывать
//             this._dataListForPagination = [];
//             this._dataOnCurrentPage_observable = [];
//             return;
//         }
//
//         if (!this._auxiliaryData_observable || !this._paginationSelectedData_observable) {
//             // Делаем вывод, что данные передали первый раз
//             this.setNewDataListForPagination(dataListForPagination);
//             return;
//         }
//
//         // Запоминаем набор данных
//         this._dataListForPagination = dataListForPagination;
//         // Общее количество элементов
//         const totalItemsCount = this._dataListForPagination.length;
//         // Получаем список возможного отображения элементов на странице
//         const listItemsOnPage = this._getListItemsOnPage();
//         // Текущее выбранное значение элементов на странице
//         let selectedItemsOnPage: DropdownSelectItem = Object.assign({}, this._paginationSelectedData_observable.selectedItemsOnPage);
//         if (isResetSelectedItemsOnPage) {
//             // Сбрасываем выбранное количество элементов на странице
//             selectedItemsOnPage = Object.assign({}, listItemsOnPage[0]);
//         }
//         // Максимальное количество страниц
//         const maxPagesNumber = this._countMaxPages({
//             itemsOnPageNumber: selectedItemsOnPage.value,
//             totalItemsNumber: totalItemsCount
//         });
//         // Получаем список страниц пагинации
//         const listPages: DropdownSelectItem[] = this._getListPagination({
//             maxPagesNumber: maxPagesNumber
//         });
//         //Текущая выбранная страница
//         let selectedCurrentPage: DropdownSelectItem = Object.assign({}, listPages[0]);
//
//         if (!isResetSelectedCurrentPage) {
//             // Пытаемся сохранить старую страницу
//             const trySaveOldCurrentPage = Object.assign({}, this._paginationSelectedData_observable.selectedCurrentPage);
//             const newPageTmp = this._trySaveCurrentPage({
//                 listPages: listPages,
//                 selectedCurrentPage: trySaveOldCurrentPage
//             });
//
//             // Устанавливаем новую текущую страницу или оставляем старую
//             selectedCurrentPage = newPageTmp ? newPageTmp : this._getEmptyPaginationItem();
//         }
//
//         //Запоминаем вспомогательные данные
//         this._auxiliaryData_observable = {
//             maxPagesNumber: maxPagesNumber,
//             listItemsOnPage: listItemsOnPage,
//             listPages: listPages,
//             totalItemsCount: totalItemsCount
//         };
//
//         // Устанавливаем выбранные данные
//         this._paginationSelectedData_observable = {
//             selectedItemsOnPage: selectedItemsOnPage,
//             selectedCurrentPage: selectedCurrentPage
//         };
//         // Устанавливаем данные на текущей странице
//         this._dataOnCurrentPage_observable = this._getItemsForPage({
//             selectedCurrentPageNumber: selectedCurrentPage.value,
//             selectedItemsOnPageNumber: selectedItemsOnPage.value,
//             dataListForPagination: this._dataListForPagination
//         });
//     }
//
//     /**
//      * Попытаться сохранит
//      * @param options
//      * @private
//      */
//     private _trySaveCurrentPage(options: TrySaveCurrentPageOptions): DropdownSelectItem | undefined {
//         const {listPages, selectedCurrentPage} = options;
//
//         if (!listPages.length) {
//             // Список страниц пуст, выходим
//             return undefined;
//         }
//
//         if (listPages.length === 1) {
//             // Только одна страница, нечего вычислять
//             return options.listPages[0];
//         }
//
//         const lastPage = listPages[listPages.length - 1];
//
//         if (selectedCurrentPage.value > lastPage.value) {
//             return lastPage;
//         } else {
//             return selectedCurrentPage;
//         }
//     }
//
//     /**
//      * Данные пустые и не установлены
//      */
//     get isEmptyData(): boolean {
//         if (!this._paginationSelectedData_observable) {
//             return true;
//         }
//
//         if (!this._paginationSelectedData_observable) {
//             return true;
//         }
//
//         return !this._dataOnCurrentPage_observable.length;
//     }
//
//     //endregion
//
//     //region Отображаемые данные на текущей странице
//     private _dataOnCurrentPage_observable: DataItem[];
//
//     /**
//      * Получить данные на текущей странице
//      */
//     get dataOnCurrentPage() {
//         return this._dataOnCurrentPage_observable;
//     }
//
//     //endregion
//
//     //region Информация о пагинации
//     private _paginationSelectedData_observable?: PaginationSelectedData;
//
//     get paginationSelectedData() {
//         return this._paginationSelectedData_observable;
//     }
//
//     //endregion
//
//     /**
//      * Сбросить все данные хранилища
//      */
//     public resetStoreData() {
//         // Сбрасываем все данные
//         this._dataListForPagination = [];
//         this._dataOnCurrentPage_observable = [];
//         this._paginationSelectedData_observable = undefined;
//         this._auxiliaryData_observable = undefined;
//     }
//
//     constructor() {
//         this.eventChangeCurrentPage = this.eventChangeCurrentPage.bind(this);
//         this.eventChangeItemsOnPage = this.eventChangeItemsOnPage.bind(this);
//         this.eventClickPrevBtn = this.eventClickPrevBtn.bind(this);
//         this.eventClickNextBtn = this.eventClickNextBtn.bind(this);
//
//         this._dataListForPagination = [];
//         this._dataOnCurrentPage_observable = [];
//         this._paginationSelectedData_observable = undefined;
//         this._auxiliaryData_observable = undefined;
//
//         //observable action computed
//         makeObservable<this,
//             '_dataOnCurrentPage_observable'
//             | '_paginationSelectedData_observable'
//             | '_auxiliaryData_observable'>(this, {
//             _dataOnCurrentPage_observable: observable.ref,
//             _paginationSelectedData_observable: observable.ref,
//             _auxiliaryData_observable: observable.ref,
//             dataOnCurrentPage: computed,
//             paginationSelectedData: computed,
//             isEmptyData: computed,
//             setNewDataListForPagination: action,
//             updateCurrentDataPagination: action,
//             eventChangeItemsOnPage: action,
//             eventChangeCurrentPage: action,
//             eventClickPrevBtn: action,
//             eventClickNextBtn: action,
//             resetStoreData: action
//         });
//     }
//
//     //region События
//
//     /**
//      * Событие изменить количество элементов на странице
//      * @param itemsOnPage
//      */
//     public eventChangeItemsOnPage(itemsOnPage: DropdownSelectCurrentSelectedItem) {
//         if (!itemsOnPage) {
//             return;
//         }
//
//         if (!this._paginationSelectedData_observable) {
//             return;
//         }
//
//         if (!this._auxiliaryData_observable) {
//             return;
//         }
//
//         if (!this._dataListForPagination.length) {
//             return;
//         }
//
//         if (itemsOnPage.value === this._paginationSelectedData_observable.selectedItemsOnPage.value) {
//             return;
//         }
//
//         // Копируем выбранные данные
//         const copyPaginationSelectedData = Object.assign({}, this._paginationSelectedData_observable);
//         // Копируем вспомогательные данные
//         const copyAuxiliaryData = Object.assign({}, this._auxiliaryData_observable);
//         // Изменяем количество элементов на странице
//         copyPaginationSelectedData.selectedItemsOnPage = itemsOnPage;
//
//         // Максимальное количество страниц
//         const maxPagesNumber = this._countMaxPages({
//             itemsOnPageNumber: copyPaginationSelectedData.selectedItemsOnPage.value,
//             totalItemsNumber: copyAuxiliaryData.totalItemsCount
//         });
//         // Получаем список страниц пагинации
//         const listPages = this._getListPagination({
//             maxPagesNumber: maxPagesNumber
//         });
//
//         const newCurrentPage = this._trySaveCurrentPage({
//             listPages: listPages,
//             selectedCurrentPage: copyPaginationSelectedData.selectedCurrentPage
//         });
//
//         // Устанавливаем новую выбранную страницу
//         copyPaginationSelectedData.selectedCurrentPage = newCurrentPage ? newCurrentPage : this._getEmptyPaginationItem();
//         copyAuxiliaryData.maxPagesNumber = maxPagesNumber;
//         copyAuxiliaryData.listPages = listPages;
//
//         //Запоминаем вспомогательные данные
//         this._auxiliaryData_observable = copyAuxiliaryData;
//         // Устанавливаем выбранные данные
//         this._paginationSelectedData_observable = copyPaginationSelectedData;
//         // Устанавливаем данные на текущей странице
//         this._dataOnCurrentPage_observable = this._getItemsForPage({
//             selectedCurrentPageNumber: copyPaginationSelectedData.selectedCurrentPage.value,
//             selectedItemsOnPageNumber: copyPaginationSelectedData.selectedItemsOnPage.value,
//             dataListForPagination: this._dataListForPagination
//         });
//     }
//
//     /**
//      * Показать следующую страницу
//      */
//     public eventClickNextBtn() {
//         if (!this._paginationSelectedData_observable) {
//             return;
//         }
//
//         if (!this._auxiliaryData_observable) {
//             return;
//         }
//
//         if (!this._dataListForPagination.length) {
//             return;
//         }
//
//         // Получаем номер текущей страницы
//         const currentPageNumber: number = this._paginationSelectedData_observable.selectedCurrentPage.value;
//         // Номер следующей страницы
//         const nextPageNumber = currentPageNumber + 1;
//         // Пытаемся получить следующую страницу
//         const nextPage = this._getPageByNumber(nextPageNumber);
//         if (!nextPage) {
//             return;
//         }
//
//         // Копируем выбранные данные
//         const copyPaginationSelectedData = Object.assign({}, this._paginationSelectedData_observable);
//         // Изменяем выбранную страницу
//         copyPaginationSelectedData.selectedCurrentPage = nextPage;
//         // Устанавливаем выбранные данные
//         this._paginationSelectedData_observable = copyPaginationSelectedData;
//         // Устанавливаем данные на текущей странице
//         this._dataOnCurrentPage_observable = this._getItemsForPage({
//             selectedCurrentPageNumber: copyPaginationSelectedData.selectedCurrentPage.value,
//             selectedItemsOnPageNumber: copyPaginationSelectedData.selectedItemsOnPage.value,
//             dataListForPagination: this._dataListForPagination
//         });
//     }
//
//     /**
//      * Показать предыдущую страницу
//      */
//     public eventClickPrevBtn() {
//         if (!this._paginationSelectedData_observable) {
//             return;
//         }
//
//         if (!this._auxiliaryData_observable) {
//             return;
//         }
//
//         if (!this._dataListForPagination.length) {
//             return;
//         }
//
//         // Получаем номер текущей страницы
//         const currentPageNumber: number = this._paginationSelectedData_observable.selectedCurrentPage.value;
//         // Номер Предыдущей страницы
//         const prevPageNumber = currentPageNumber - 1;
//         // Пытаемся получить предыдущую страницу
//         const prevPage = this._getPageByNumber(prevPageNumber);
//         if (!prevPage) {
//             return;
//         }
//
//         // Копируем выбранные данные
//         const copyPaginationSelectedData = Object.assign({}, this._paginationSelectedData_observable);
//         // Изменяем выбранную страницу
//         copyPaginationSelectedData.selectedCurrentPage = prevPage;
//         // Устанавливаем выбранные данные
//         this._paginationSelectedData_observable = copyPaginationSelectedData;
//         // Устанавливаем данные на текущей странице
//         this._dataOnCurrentPage_observable = this._getItemsForPage({
//             selectedCurrentPageNumber: copyPaginationSelectedData.selectedCurrentPage.value,
//             selectedItemsOnPageNumber: copyPaginationSelectedData.selectedItemsOnPage.value,
//             dataListForPagination: this._dataListForPagination
//         });
//     }
//
//     /**
//      * Изменить текущую страницу
//      * @param newCurrentPage
//      */
//     public eventChangeCurrentPage(newCurrentPage: DropdownSelectCurrentSelectedItem) {
//         if (!newCurrentPage) {
//             return;
//         }
//
//         if (!this._paginationSelectedData_observable) {
//             return;
//         }
//
//         if (!this._auxiliaryData_observable) {
//             return;
//         }
//
//         if (!this._dataListForPagination.length) {
//             return;
//         }
//
//         if (newCurrentPage.value === this._paginationSelectedData_observable.selectedCurrentPage.value) {
//             return;
//         }
//
//         // Копируем выбранные данные
//         const copyPaginationSelectedData = Object.assign({}, this._paginationSelectedData_observable);
//         // Изменяем выбранную страницу
//         copyPaginationSelectedData.selectedCurrentPage = newCurrentPage;
//         // Устанавливаем выбранные данные
//         this._paginationSelectedData_observable = copyPaginationSelectedData;
//         // Устанавливаем данные на текущей странице
//         this._dataOnCurrentPage_observable = this._getItemsForPage({
//             selectedCurrentPageNumber: copyPaginationSelectedData.selectedCurrentPage.value,
//             selectedItemsOnPageNumber: copyPaginationSelectedData.selectedItemsOnPage.value,
//             dataListForPagination: this._dataListForPagination
//         });
//     }
//
//     //endregion
//
//     /**
//      * Получить страницу по номеру
//      * @param pageNumber
//      * @private
//      */
//     private _getPageByNumber(pageNumber: number): DropdownSelectItem | undefined {
//         if (!this._auxiliaryData_observable) {
//             return undefined;
//         }
//
//         const isPageCorrect: boolean = this._checkPageNumber({
//             pageNumber: pageNumber,
//             maxPagesNumber: this._auxiliaryData_observable.maxPagesNumber
//         });
//
//         if (!isPageCorrect) {
//             return undefined;
//         }
//
//         // Страницы понятные для людей (считаются с 1), поэтому отнимаем единицу
//         return this._auxiliaryData_observable.listPages[pageNumber - 1];
//     }
//
//     /**
//      * Проверяет номер страницы
//      * Если true страница прошла проверку
//      * @param options
//      * @private
//      */
//     private _checkPageNumber(options: CheckPageNumberOptions): boolean {
//         const {pageNumber, maxPagesNumber} = options;
//
//         //Номер страницы не может быть меньше 0 или 0
//         if (pageNumber <= 0) {
//             return false;
//         }
//         return options.pageNumber <= maxPagesNumber;
//     }
//
//     /**
//      * Получить элементы для текущей страницы
//      * @private
//      */
//     private _getItemsForPage(options: GetItemsForPageOptions<DataItem>): DataItem[] {
//         const {selectedCurrentPageNumber, selectedItemsOnPageNumber, dataListForPagination} = options;
//
//         if (!selectedCurrentPageNumber) {
//             return [];
//         }
//
//         if (!selectedItemsOnPageNumber) {
//             return [];
//         }
//
//         if (!dataListForPagination.length) {
//             return [];
//         }
//
//         const totalItemsNumber: number = options.dataListForPagination.length;
//         const startIndex = (selectedCurrentPageNumber - 1) * selectedItemsOnPageNumber;
//         // Желаемое количество элементов на странице
//         const desiredCountElementsOnPage = startIndex + selectedItemsOnPageNumber;
//         const lastIndex = (desiredCountElementsOnPage > totalItemsNumber) ? totalItemsNumber : desiredCountElementsOnPage
//         const resultElementsOnPage: DataItem[] = [];
//
//         for (let i = startIndex; i < lastIndex; ++i) {
//             resultElementsOnPage.push(dataListForPagination[i]);
//         }
//
//         return resultElementsOnPage;
//     }
//
//
//     /**
//      * Получить элемент списка количество элементов на странице
//      * @param pageNumber
//      * @private
//      */
//     private _createListItemOnPage(pageNumber: number): DropdownSelectItem {
//         return {
//             label: String(pageNumber),
//             value: pageNumber
//         }
//     }
//
//     /**
//      * Возвращает список, количество элементов на странице
//      * @private
//      */
//     private _getListItemsOnPage(): DropdownSelectItem[] {
//         const result: DropdownSelectItem[] = [];
//         for (let i = 5; i <= 100; i += 5) {
//             result.push(this._createListItemOnPage(i));
//         }
//
//         return result;
//     }
//
//     /**
//      * Получить список пагинации
//      * @param options
//      * @private
//      */
//     private _getListPagination(options: GetListPaginationOptions): DropdownSelectItem[] {
//         const maxPagesNumber: number = options.maxPagesNumber;
//
//         if (maxPagesNumber <= 0) {
//             return [];
//         }
//
//         const resultPagesList: DropdownSelectItem[] = [];
//
//         // Страницы идут с 1, а не 0, т.к. люди привыкли считать с 1 =)
//         for (let i = 1; i <= maxPagesNumber; ++i) {
//             resultPagesList.push({
//                 value: i,
//                 label: String(i)
//             });
//         }
//
//         return resultPagesList;
//     }
//
//     /**
//      * Посчитать максимальное количество страниц
//      * @param options
//      * @private
//      */
//     private _countMaxPages(options: CountMaxPagesOptions): number {
//         const {totalItemsNumber, itemsOnPageNumber} = options;
//         const remainder = totalItemsNumber % itemsOnPageNumber;
//         const rawMaxPages: number = (totalItemsNumber - remainder) / itemsOnPageNumber;
//         return (remainder > 0) ? (rawMaxPages + 1) : rawMaxPages;
//     }
// }
