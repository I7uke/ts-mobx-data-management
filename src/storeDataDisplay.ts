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
    readonly numberItemsPerPage: number;
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
        numberItemsPerPage: 0,
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

    if (integer < 0) {
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
    readonly numberItemsPerPage: number;
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

    const numberItemsPerPage: number = validationNumber({
        valueForValidation: params.numberItemsPerPage,
        defaultValue: 0
    });

    if (!totalItems) {
        return 0;
    }

    if (numberItemsPerPage === 0) {
        return 0;
    }

    const remainder: number = totalItems % numberItemsPerPage;

    if (remainder === 0) {
        return totalItems / numberItemsPerPage;
    }

    return (Math.trunc(totalItems / numberItemsPerPage)) + 1
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
    readonly numberItemsPerPage: number;
    /**
     * Текущая страница
     */
    readonly currentPage: number;
    /**
     * Список всех элементов
     */
    readonly itemsList: TItem[];
    /**
     * Возможные колличества элементов на странице
     */
    readonly availableNumberItemsOnPage: number[];
}

function getPagination<TItem extends DataSourceItem>(params: GetPaginationParams<TItem>): Pagination<TItem> {
    const totalItems: number = validationNumber({
        valueForValidation: params.itemsList.length,
        defaultValue: 0
    });

    if (!totalItems) {
        return getEmptyPagination();
    }

    const numberItemsPerPage: number = validationNumber({
        valueForValidation: params.numberItemsPerPage,
        defaultValue: 0
    });

    if (!numberItemsPerPage) {
        return getEmptyPagination();
    }

    const maxPages: number = countMaxPages({
        totalItems: totalItems,
        numberItemsPerPage: numberItemsPerPage
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

    // Включая
    let startIndex: number = (currentPage - 1) * numberItemsPerPage;

    if (startIndex < 0) {
        startIndex = 0;
    }

    // Не включая
    let endIndex: number = startIndex + numberItemsPerPage;

    if (endIndex > params.itemsList.length) {
        endIndex = params.itemsList.length;
    }

    const itemsOnCurrentPage = params.itemsList.slice(startIndex, endIndex);

    return {
        maxPages: maxPages,
        totalItems: totalItems,
        numberItemsPerPage: numberItemsPerPage,
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
    readonly itemsList: TItem[];
    /**
     * Возможные колличества элементов на странице
     */
    readonly availableNumberItemsOnPage?: number[];
    /**
     * Количество элементов на одной странице
     */
    readonly numberItemsPerPage: number;
    /**
     * Текущая страница
     */
    readonly currentPage: number;
}

export default class StoreDataDisplay<TItem extends DataSourceItem> {
    private _itemsList: TItem[];
    private _pagination_observable: Pagination<TItem>;

    private _setPagination_action(pagination: Pagination<TItem>) {
        this._pagination_observable = pagination;
    }


    public setOptions(params: Partial<GetPaginationParams<TItem>>){


    }


    /**
     * Элементы на текущей странице
     */
    get itemsOnCurrentPage(): TItem[] {
        return this._pagination_observable.itemsOnCurrentPage;
    }

    /**
     * Текущая страница
     */
    get currentPage(): number {
        return this._pagination_observable.currentPage;
    }

    /**
     * Установить текущую страницу
     * @param page
     */
    public setCurrentPage(page: number) {
        const validCurrentPage: number = validationCurrentPage({
            currentPage: page,
            maxPages: this._pagination_observable.currentPage
        });

        const newPagination = getPagination({
            currentPage: validCurrentPage,
            availableNumberItemsOnPage: this._pagination_observable.availableNumberItemsOnPage,
            numberItemsPerPage: this._pagination_observable.numberItemsPerPage,
            itemsList: this._itemsList
        });

        this._setPagination_action(newPagination);
    }

    /**
     * Возможные колличества элементов на странице
     */
    get availableNumberItemsOnPage(): number[] {
        return this._pagination_observable.availableNumberItemsOnPage;
    }

    /**
     * Установить массив возможного колличества элементов на странице
     * @param numberItemsPerPage
     */
    public setAvailableNumberItemsOnPage(numberItemsPerPage: number[]) {
        const newPagination = getPagination({
            currentPage: this._pagination_observable.currentPage,
            availableNumberItemsOnPage: validationAvailableNumberItemsOnPage(numberItemsPerPage),
            numberItemsPerPage: this._pagination_observable.numberItemsPerPage,
            itemsList: this._itemsList
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
    get numberItemsPerPage(): number {
        return this._pagination_observable.numberItemsPerPage;
    }

    /**
     * Установить количество элементов на одной странице
     * @param numberItemsPerPage
     */
    public setNumberItemsPerPage(numberItemsPerPage: number) {
        const validItemsOnPage = validationNumber({
            valueForValidation: numberItemsPerPage,
            defaultValue: 0
        });

        const newPagination = getPagination({
            currentPage: this._pagination_observable.currentPage,
            availableNumberItemsOnPage: this._pagination_observable.availableNumberItemsOnPage,
            numberItemsPerPage: validItemsOnPage,
            itemsList: this._itemsList
        });

        this._setPagination_action(newPagination);
    }

    /**
     * Общее количество элементов
     */
    get totalItems(): number {
        return this._pagination_observable.totalItems;
    }

    /**
     * Показать следующую страницу
     */
    public eventShowNextPage() {
        if (!this._itemsList.length) {
            return;
        }

        const maxPages: number = this._pagination_observable.maxPages;
        const nextPage: number = validationCurrentPage({
            maxPages: maxPages,
            currentPage: this._pagination_observable.currentPage + 1
        });

        if(!nextPage) {
            return;
        }

        if(nextPage === this._pagination_observable.currentPage) {
            return;
        }

        const newPagination = getPagination({
            currentPage: nextPage,
            availableNumberItemsOnPage: this._pagination_observable.availableNumberItemsOnPage,
            numberItemsPerPage: this._pagination_observable.numberItemsPerPage,
            itemsList: this._itemsList
        });

        this._setPagination_action(newPagination);
    }

    /**
     * Показать предыдущую страницу
     */
    public eventShowPrevPage() {
        if (!this._itemsList.length) {
            return;
        }

        const maxPages: number = this._pagination_observable.maxPages;

        const prevPage: number = validationCurrentPage({
            currentPage: this._pagination_observable.currentPage - 1,
            maxPages: maxPages
        });

        if (!prevPage) {
            return;
        }

        if(prevPage === this._pagination_observable.currentPage) {
            return;
        }

        const newPagination = getPagination({
            currentPage: prevPage,
            availableNumberItemsOnPage: this._pagination_observable.availableNumberItemsOnPage,
            numberItemsPerPage: this._pagination_observable.numberItemsPerPage,
            itemsList: this._itemsList
        });

        this._setPagination_action(newPagination);
    }

    constructor(init: InitStoreDataDisplay<TItem>) {
        this.eventShowPrevPage = this.eventShowPrevPage.bind(this);
        this.eventShowNextPage = this.eventShowNextPage.bind(this);

        this._itemsList = init.itemsList;

        this._pagination_observable = getPagination({
            availableNumberItemsOnPage: validationAvailableNumberItemsOnPage(init.availableNumberItemsOnPage),
            numberItemsPerPage: validationNumber({
                valueForValidation: init.numberItemsPerPage,
                defaultValue: 0
            }),
            currentPage: validationNumber({
                valueForValidation: init.currentPage,
                defaultValue: 0
            }),
            itemsList: this._itemsList
        });

        makeObservable<this,
            '_pagination_observable' |
            '_setPagination_action'>(this, {
            _pagination_observable: observable.ref,
            _setPagination_action: action,
            itemsOnCurrentPage: computed,
            currentPage: computed,
            availableNumberItemsOnPage: computed,
            maxPages: computed,
            numberItemsPerPage: computed,
            totalItems: computed
        });
    }
}
