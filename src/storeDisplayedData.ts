import {action, computed, makeObservable, observable} from "mobx";
import {DataSourceItem} from "./index";

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
type DataStatus = 'notSet' | 'empty' | 'installed';
type CallbackForceUpdate<TItem extends DataSourceItem> = () => TItem[];

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

//region ПроверкиitemsList
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
 * @param param
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
interface GetPaginationParams<TItem extends DataSourceItem> {
    /**
     * Количество элементов на одной странице
     */
    readonly numberItemsPerPage: number;
    /**
     * Текущая страница, ВАЖНО! отсчет идет с 1
     */
    readonly currentPage: number;
    /**
     * Список всех элементов
     */
    readonly itemsList: TItem[];
    /**
     * Возможные количества элементов на странице
     */
    readonly availableNumberItemsOnPage: number[];
}

function getPagination<TItem extends DataSourceItem>(params: GetPaginationParams<TItem>): Pagination<TItem> {
    if (!Array.isArray(params.itemsList)) {
        return getEmptyPagination();
    }

    if (!params.itemsList.length) {
        return getEmptyPagination();
    }

    const totalItems: number = params.itemsList.length;

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

export type InitStoreDisplayedData<TItem extends DataSourceItem> = {
    /**
     * Источник данных
     */
    readonly itemsList?: TItem[];
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
     * ВАЖНО! отсчет идет с 1
     */
    readonly currentPage: number;
}

interface InternalPagination<TItem extends DataSourceItem> {
    /**
     * Текущая страница
     */
    readonly currentPage: number;
    /**
     * Возможные количества элементов на странице
     */
    readonly numberItemsPerPage: number;
    /**
     * Список всех элементов
     */
    readonly itemsList: TItem[];
}

export default class StoreDisplayedData<TItem extends DataSourceItem> {
    private _internalData: InternalPagination<TItem>;
    private _pagination_observable: Pagination<TItem>;
    private _callbackForceUpdate?: CallbackForceUpdate<TItem>;

    private _setPagination_action(pagination: Pagination<TItem>) {
        this._pagination_observable = pagination;
    }

    private _dataStatus_observable: DataStatus;

    /**
     * Установить список элементов без триггеров
     * Данная установка не вызовет обновления данных в визуальном представлении
     * @param itemsList
     */
    public setItemsListWithoutTriggers(itemsList: TItem[]) {
        if (!Array.isArray(!itemsList)) {
            return;
        }
        this._internalData = this._changeInternalData({
            itemsList: itemsList
        });
    }

    /**
     * Применить принудительное обновление
     * После применения
     * @private
     */
    private _applyCallbackForceUpdate() {
        if (typeof this._callbackForceUpdate !== 'function') {
            return;
        }

        const newItemsList = this._callbackForceUpdate();
        this._callbackForceUpdate = undefined;

        if (!Array.isArray(newItemsList)) {
            return;
        }

        this._internalData = this._changeInternalData({
            itemsList: newItemsList
        });
    }

    /**
     * Установить callback принудительного обновления
     * callback будет вызван при изменении данных в методах: setOptions, eventShowPrevPage, eventShowNextPage
     * @param callback
     */
    public setForceUpdate(callback: CallbackForceUpdate<TItem>) {
        if (typeof callback !== 'function') {
            return;
        }

        this._callbackForceUpdate = callback;
    }

    /**
     * Удалить callback принудительного обновления
     */
    public removeForceUpdate() {
        this._callbackForceUpdate = undefined;
    }

    /**
     * Очищает все переданные данные
     * Будет возвравщен в первоначальное состояние
     */
    public destroy() {
        this._internalData = {
            itemsList: [],
            numberItemsPerPage: 0,
            currentPage: 0
        };

        this._callbackForceUpdate = undefined;
        this._dataStatus_observable = 'notSet';
        this._pagination_observable = getEmptyPagination();
    }

    /**
     * Установить параметры
     * Будут учитываться только переданные поля
     * Если поле отсутствует то будет сохранено текущее значение этого поля
     * @param params
     */
    public setOptions(params: Partial<GetPaginationParams<TItem>>) {
        if (!Array.isArray(params.itemsList)
            && typeof params.numberItemsPerPage !== 'number'
            && typeof params.currentPage !== 'number'
            && !Array.isArray(params.availableNumberItemsOnPage)
        ) {
            return;
        }

        this._applyCallbackForceUpdate();


        this._internalData = this._changeInternalData({
            itemsList: params.itemsList,
            currentPage: params.currentPage,
            numberItemsPerPage: params.numberItemsPerPage
        });


        this._dataStatus_observable = this._internalData.itemsList.length ? 'installed' : 'empty';

        this._pagination_observable = getPagination({
            numberItemsPerPage: this._internalData.numberItemsPerPage,
            currentPage: this._internalData.currentPage,
            itemsList: this._internalData.itemsList,
            availableNumberItemsOnPage: Array.isArray(params.availableNumberItemsOnPage) ? params.availableNumberItemsOnPage : this._pagination_observable.availableNumberItemsOnPage,
        });
    }

    /**
     * Статус данных
     */
    get dataStatus(): DataStatus {
        return this._dataStatus_observable;
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
     * Возможные количества элементов на странице
     */
    get availableNumberItemsOnPage(): number[] {
        return this._pagination_observable.availableNumberItemsOnPage;
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
     * Общее количество элементов
     */
    get totalItems(): number {
        return this._pagination_observable.totalItems;
    }

    /**
     * Перейти на первую страницу
     */
    public goToFirstPage(): void {
        this._internalData = this._changeInternalData({
            currentPage: 1,
        });

        const newPagination = getPagination({
            availableNumberItemsOnPage: this._pagination_observable.availableNumberItemsOnPage,
            currentPage: this._internalData.currentPage,
            numberItemsPerPage: this._internalData.numberItemsPerPage,
            itemsList: this._internalData.itemsList
        });

        this._setPagination_action(newPagination);
    }

    /**
     * Перейти на последнюю страницу
     */
    public goToLastPage(): void {
        this._internalData = this._changeInternalData({
            currentPage: this._pagination_observable.maxPages,
        });

        const newPagination = getPagination({
            availableNumberItemsOnPage: this._pagination_observable.availableNumberItemsOnPage,
            currentPage: this._internalData.currentPage,
            numberItemsPerPage: this._internalData.numberItemsPerPage,
            itemsList: this._internalData.itemsList
        });

        this._setPagination_action(newPagination);
    }

    /**
     * Показать следующую страницу
     */
    public eventShowNextPage() {
        if (!this._internalData.itemsList.length) {
            return;
        }

        const maxPages: number = this._pagination_observable.maxPages;
        const nextPage: number = validationCurrentPage({
            maxPages: maxPages,
            currentPage: this._internalData.currentPage + 1
        });

        if (!nextPage) {
            return;
        }

        if (nextPage === this._internalData.currentPage) {
            return;
        }

        this._applyCallbackForceUpdate();

        this._internalData = this._changeInternalData({
            currentPage: nextPage
        });

        const newPagination = getPagination({
            currentPage: this._internalData.currentPage,
            availableNumberItemsOnPage: this._pagination_observable.availableNumberItemsOnPage,
            numberItemsPerPage: this._internalData.numberItemsPerPage,
            itemsList: this._internalData.itemsList
        });

        this._setPagination_action(newPagination);
    }

    /**
     * Показать предыдущую страницу
     */
    public eventShowPrevPage() {
        if (!this._internalData.itemsList.length) {
            return;
        }

        const maxPages: number = this._pagination_observable.maxPages;

        const prevPage: number = validationCurrentPage({
            currentPage: this._internalData.currentPage - 1,
            maxPages: maxPages
        });

        if (!prevPage) {
            return;
        }

        if (prevPage === this._internalData.currentPage) {
            return;
        }

        this._applyCallbackForceUpdate();

        this._internalData = this._changeInternalData({
            currentPage: prevPage
        });

        const newPagination = getPagination({
            currentPage: this._internalData.currentPage,
            availableNumberItemsOnPage: this._pagination_observable.availableNumberItemsOnPage,
            numberItemsPerPage: this._internalData.numberItemsPerPage,
            itemsList: this._internalData.itemsList
        });

        this._setPagination_action(newPagination);
    }

    private _changeInternalData(params?: Partial<InternalPagination<TItem>>): InternalPagination<TItem> {
        const inputItemsList: TItem[] | undefined | null = params?.itemsList;
        const inputNumberItemsPerPage: number | undefined | null = params?.numberItemsPerPage;
        const inputCurrentPage: number | undefined | null = params?.currentPage;

        const tmpItemsList: TItem[] | undefined | null = this?._internalData?.itemsList;
        const tmpCurrentPage: number | undefined | null = this?._internalData?.currentPage;
        const tmpNumberItemsPerPage: number | undefined | null = this?._internalData?.numberItemsPerPage;

        let itemsList: TItem[] = Array.isArray(tmpItemsList) ? tmpItemsList : [];

        let currentPage: number = validationNumber({
            valueForValidation: tmpCurrentPage,
            defaultValue: 0
        });

        let numberItemsPerPage: number = validationNumber({
            valueForValidation: tmpNumberItemsPerPage,
            defaultValue: 0
        });

        if (Array.isArray(inputItemsList)) {
            itemsList = inputItemsList;
        }

        if (typeof inputCurrentPage === 'number') {
            currentPage = validationNumber({
                valueForValidation: inputCurrentPage,
                defaultValue: 0
            });
        }

        if (typeof inputNumberItemsPerPage === 'number') {
            numberItemsPerPage = validationNumber({
                valueForValidation: inputNumberItemsPerPage,
                defaultValue: 0
            });
        }

        return {
            numberItemsPerPage: numberItemsPerPage,
            currentPage: currentPage,
            itemsList: itemsList
        }
    }

    constructor(init?: InitStoreDisplayedData<TItem>) {
        this.eventShowPrevPage = this.eventShowPrevPage.bind(this);
        this.eventShowNextPage = this.eventShowNextPage.bind(this);
        this.goToFirstPage = this.goToFirstPage.bind(this);
        this.goToLastPage = this.goToLastPage.bind(this);

        let itemsList: TItem[] = [];
        let dataStatus: DataStatus = 'notSet';

        if (init) {
            const initItemsList: TItem[] | undefined | null = init?.itemsList;
            if (Array.isArray(initItemsList)) {
                itemsList = initItemsList;
                if (itemsList.length) {
                    dataStatus = 'installed';
                }
            }
        }

        const internalData = this._changeInternalData({
            itemsList: Array.isArray(itemsList) ? itemsList : [],
            currentPage: init?.currentPage ?? 0,
            numberItemsPerPage: init?.numberItemsPerPage ?? 0
        });

        this._internalData = internalData;

        this._callbackForceUpdate = undefined;
        this._dataStatus_observable = dataStatus;
        this._pagination_observable = getPagination({
            availableNumberItemsOnPage: validationAvailableNumberItemsOnPage(init?.availableNumberItemsOnPage),
            numberItemsPerPage: this._internalData.numberItemsPerPage,
            currentPage: this._internalData.currentPage,
            itemsList: this._internalData.itemsList
        });

        makeObservable<this,
            '_pagination_observable' |
            '_dataStatus_observable' |
            '_setPagination_action'>(this, {
            _pagination_observable: observable.ref,
            _dataStatus_observable: observable.ref,
            _setPagination_action: action,
            setOptions: action,
            destroy: action,
            itemsOnCurrentPage: computed,
            currentPage: computed,
            availableNumberItemsOnPage: computed,
            maxPages: computed,
            numberItemsPerPage: computed,
            totalItems: computed
        });
    }
}
