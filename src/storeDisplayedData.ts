import {action, computed, makeObservable, observable} from "mobx";
import {DataSourceItem} from "./index";

type CurrentPageType = number | 'firstPage' | 'lastPage';

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
    }
}

//endregion

//region Проверки itemsList
function validationAvailableNumberItemsOnPage(numList?: number[] | null): number[] {

    if (!Array.isArray(numList)) {
        return getDefaultAvailableNumberItemsOnPage();
    }

    if (!numList.length) {
        return getDefaultAvailableNumberItemsOnPage();
    }

    const integerNumbers: number[] = [];

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

        integerNumbers.push(num);
    }

    const uniqueValues: number[] = [...new Set<number>(integerNumbers)];


    if (!uniqueValues.length) {
        return getDefaultAvailableNumberItemsOnPage();
    }

    return uniqueValues;
}


type ValidationNumberParam = {
    readonly valueForValidation: number | null | undefined;
    readonly defaultValue: number;
}

/**
 * Проверить число
 * @param param
 */
function validationNumber(param: ValidationNumberParam): number {

    if (typeof param.valueForValidation !== 'number') {
        return param.defaultValue;
    }

    if (isNaN(param.valueForValidation)) {
        return param.defaultValue;
    }

    if (param.valueForValidation === Infinity) {
        return param.defaultValue;
    }

    if (param.valueForValidation === -Infinity) {
        return param.defaultValue;
    }

    const integer = Math.trunc(param.valueForValidation);

    if (integer < 0) {
        return param.defaultValue;
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
    const numberItemsPerPage: number = validationNumber({
        valueForValidation: params.numberItemsPerPage,
        defaultValue: 0
    });

    const totalItems = validationNumber({
        valueForValidation: params.totalItems,
        defaultValue: 0
    });

    if (!totalItems) {
        return 0;
    }

    if (!numberItemsPerPage) {
        return 0;
    }

    const remainder: number = totalItems % numberItemsPerPage;

    if (!remainder) {
        return totalItems / numberItemsPerPage;
    }

    return (Math.trunc(totalItems / numberItemsPerPage)) + 1
}

//endregion

//region Проверка текущей страницы
type ValidationCurrentPageParams = {
    readonly maxPages: number;
    readonly currentPage: CurrentPageType;
}

function validationCurrentPage(params: ValidationCurrentPageParams): number {
    const maxPages: number = validationNumber({
        valueForValidation: params.maxPages,
        defaultValue: 0
    });

    const inputCurrentPage: CurrentPageType = params.currentPage;

    if (!maxPages) {
        return 0;
    }

    let resultCurrentPage: number = 0;
    if (typeof inputCurrentPage === 'number') {
        resultCurrentPage = validationNumber({
            valueForValidation: inputCurrentPage,
            defaultValue: 0
        });
    } else if (inputCurrentPage === 'firstPage') {
        resultCurrentPage = 1;
    } else if (inputCurrentPage === 'lastPage') {
        resultCurrentPage = maxPages;
    }

    if (resultCurrentPage > maxPages) {
        return maxPages;
    }

    return resultCurrentPage;
}

//endregion

//region Получить пагинацию
type GetPaginationParams<TItem extends DataSourceItem> = {
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
}

function getPagination<TItem extends DataSourceItem>(params: GetPaginationParams<TItem>): Pagination<TItem> {
    if (!Array.isArray(params.itemsList)) {
        return getEmptyPagination();
    }

    if (!params.itemsList.length) {
        return getEmptyPagination();
    }

    // Всего элементов
    const totalItems: number = params.itemsList.length;
    const numberItemsPerPage: number = params.numberItemsPerPage;

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
        itemsOnCurrentPage: itemsOnCurrentPage
    }
}

//endregion

export type InitStoreDisplayedData<TItem extends DataSourceItem> = {
    /**
     * Источник данных
     */
    readonly itemsList?: TItem[] | undefined | null;
    /**
     * Возможные колличества элементов на странице
     */
    readonly availableNumberItemsOnPage?: number[] | undefined | null;
    /**
     * Количество элементов на одной странице
     */
    readonly numberItemsPerPage?: number | undefined | null;
    /**
     * Текущая страница
     * ВАЖНО! отсчет идет с 1
     */
    readonly currentPage?: number | undefined | null;
}

type InternalPagination<TItem extends DataSourceItem> = {
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


type ChangeInternalDataParams<TItem extends DataSourceItem> = {
    readonly currentPage?: CurrentPageType | undefined | null;
    readonly numberItemsPerPage?: number | undefined | null;
    readonly itemsList?: TItem[] | undefined | null;
}


type SetOptionsParams<TItem extends DataSourceItem> = {
    /**
     * Количество элементов на одной странице
     */
    readonly numberItemsPerPage?: number | undefined | null;
    /**
     * Текущая страница, ВАЖНО! отсчет идет с 1
     */
    readonly currentPage?: CurrentPageType | undefined | null;
    /**
     * Список всех элементов
     */
    readonly itemsList?: TItem[] | undefined | null;
}


export default class StoreDisplayedData<TItem extends DataSourceItem> {
    private _internalData: InternalPagination<TItem>;
    private _pagination_observable: Pagination<TItem>;
    private _callbackForceUpdate?: CallbackForceUpdate<TItem>;

    private _setPagination_action(pagination: Pagination<TItem>) {
        this._pagination_observable = pagination;
    }

    private _dataStatus_observable: DataStatus;

    //region availableNumberItemsOnPage
    /**
     * Возможные количества элементов на странице
     */
    private _availableNumberItemsOnPage_observable: number[];

    public setAvailableNumberItemsOnPage(itemsList: number[]) {
        this._availableNumberItemsOnPage_observable = validationAvailableNumberItemsOnPage(itemsList);
    }
    //endregion

    /**
     * Установить список элементов без триггеров
     * Данная установка не вызовет обновления данных в визуальном представлении
     * @param itemsList
     */
    public setItemsListWithoutTriggers(itemsList: TItem[]) {
        if (!Array.isArray(!itemsList)) {
            return;
        }
        this._changeInternalData({
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

        this._changeInternalData({
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
     * Очищает все переданные данные.
     * Будет возвращен в первоначальное состояние
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
        this._availableNumberItemsOnPage_observable = getDefaultAvailableNumberItemsOnPage();
    }

    /**
     * Установить параметры
     * Будут учитываться только переданные поля
     * Если поле отсутствует то будет сохранено текущее значение этого поля
     * @param params
     */
    public setOptions(params: SetOptionsParams<TItem>) {
        const inputCurrentPage: CurrentPageType | null | undefined = params?.currentPage;
        const inputItemsList: TItem[] | null | undefined = params?.itemsList;
        const inputNumberItemsPerPage: number | null | undefined = params?.numberItemsPerPage;

        const isMissingItemsList: boolean = !Array.isArray(inputItemsList);
        const isMissingNumberItemsPerPage: boolean = typeof inputNumberItemsPerPage !== 'number';
        const isMissingCurrentPage: boolean = (typeof inputCurrentPage !== 'number' && inputCurrentPage !== 'firstPage' && inputCurrentPage !== 'lastPage');

        if (isMissingItemsList && isMissingNumberItemsPerPage && isMissingCurrentPage) {
            return;
        }

        this._applyCallbackForceUpdate();

        this._changeInternalData({
            currentPage: inputCurrentPage,
            itemsList: inputItemsList,
            numberItemsPerPage: inputNumberItemsPerPage
        });

        this._dataStatus_observable = this._internalData.itemsList.length ? 'installed' : 'empty';

        this._pagination_observable = getPagination({
            numberItemsPerPage: this._internalData.numberItemsPerPage,
            currentPage: this._internalData.currentPage,
            itemsList: this._internalData.itemsList,
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
        return this._availableNumberItemsOnPage_observable;
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
     * Показать следующую страницу
     */
    public eventShowNextPage() {
        this._applyCallbackForceUpdate();

        if (!this._internalData.itemsList.length) {
            return;
        }

        const maxPages: number = this._pagination_observable.maxPages;
        const currentPage: number = this._pagination_observable.currentPage;
        const nextPage: number = validationCurrentPage({
            maxPages: maxPages,
            currentPage: currentPage + 1
        });

        if (!nextPage) {
            return;
        }

        if (nextPage === currentPage) {
            return;
        }

        const newPagination = getPagination({
            currentPage: nextPage,
            numberItemsPerPage: this._internalData.numberItemsPerPage,
            itemsList: this._internalData.itemsList
        });

        this._changeInternalData({
            currentPage: newPagination.currentPage
        });

        this._setPagination_action(newPagination);
    }

    /**
     * Показать предыдущую страницу
     */
    public eventShowPrevPage() {
        this._applyCallbackForceUpdate();

        if (!this._internalData.itemsList.length) {
            return;
        }

        const maxPages: number = this._pagination_observable.maxPages;
        const currentPage: number = this._pagination_observable.currentPage;
        const prevPage: number = validationCurrentPage({
            currentPage: currentPage - 1,
            maxPages: maxPages
        });

        if (!prevPage) {
            return;
        }

        if (prevPage === currentPage) {
            return;
        }

        const newPagination = getPagination({
            currentPage: prevPage,
            numberItemsPerPage: this._internalData.numberItemsPerPage,
            itemsList: this._internalData.itemsList
        });

        this._changeInternalData({
            currentPage: newPagination.currentPage
        });

        this._setPagination_action(newPagination);
    }

    private _changeInternalData(params?: ChangeInternalDataParams<TItem>): void {
        const inputItemsList: TItem[] | undefined | null = params?.itemsList;
        const inputNumberItemsPerPage: number | undefined | null = params?.numberItemsPerPage;
        const inputCurrentPage: CurrentPageType | undefined | null = params?.currentPage;

        let resultCurrentPage: number = this._internalData.currentPage;
        let resultNumberItemsPerPage: number = this._internalData.numberItemsPerPage;
        let resultItemsList: TItem[] = this._internalData.itemsList;

        if (typeof inputNumberItemsPerPage === 'number') {
            resultNumberItemsPerPage = validationNumber({
                valueForValidation: inputNumberItemsPerPage,
                defaultValue: 0
            });
        }

        if (Array.isArray(inputItemsList)) {
            resultItemsList = inputItemsList;
        }

        if (typeof inputCurrentPage === 'number') {
            resultCurrentPage = validationNumber({
                valueForValidation: inputCurrentPage,
                defaultValue: 0
            });
        } else {
            if (inputCurrentPage === 'firstPage' || inputCurrentPage === 'lastPage') {
                const totalItems: number = resultItemsList.length;
                const maxPages: number = countMaxPages({
                    totalItems: totalItems,
                    numberItemsPerPage: resultNumberItemsPerPage
                });

                resultCurrentPage = validationCurrentPage({
                    currentPage: inputCurrentPage,
                    maxPages: maxPages
                });
            }
        }

        this._internalData = {
            currentPage: resultCurrentPage,
            itemsList: resultItemsList,
            numberItemsPerPage: resultNumberItemsPerPage
        };
    }

    constructor(initData?: InitStoreDisplayedData<TItem>) {
        this.eventShowPrevPage = this.eventShowPrevPage.bind(this);
        this.eventShowNextPage = this.eventShowNextPage.bind(this);


        let dataStatus: DataStatus = 'notSet';

        let internalData: InternalPagination<TItem> = {
            currentPage: 0,
            itemsList: [],
            numberItemsPerPage: 0
        };

        let availableNumberItemsOnPage: number[] = getDefaultAvailableNumberItemsOnPage();

        if (initData) {
            const initAvailableNumberItemsOnPage: number[] | null | undefined = initData.availableNumberItemsOnPage;
            const initCurrentPage: number | null | undefined = initData.currentPage;
            const initItemsList: TItem[] | null | undefined = initData.itemsList;
            const initNumberItemsPerPage: number | null | undefined = initData.numberItemsPerPage;

            if (Array.isArray(initAvailableNumberItemsOnPage)) {
                availableNumberItemsOnPage = validationAvailableNumberItemsOnPage(initAvailableNumberItemsOnPage);
            }

            if (typeof initCurrentPage === 'number') {
                internalData = {
                    ...internalData,
                    currentPage: initCurrentPage,
                }
            }

            if (typeof initNumberItemsPerPage === 'number') {
                internalData = {
                    ...internalData,
                    numberItemsPerPage: initNumberItemsPerPage,
                }
            }

            if (Array.isArray(initItemsList)) {
                internalData = {
                    ...internalData,
                    itemsList: initItemsList
                }
                if (initItemsList.length) {
                    dataStatus = 'installed';
                }
            }
        }

        this._internalData = internalData;
        this._callbackForceUpdate = undefined;
        this._dataStatus_observable = dataStatus;
        this._availableNumberItemsOnPage_observable = availableNumberItemsOnPage;
        this._pagination_observable = getPagination({
            numberItemsPerPage: this._internalData.numberItemsPerPage,
            currentPage: this._internalData.currentPage,
            itemsList: this._internalData.itemsList
        });


        makeObservable<this,
            '_pagination_observable' |
            '_dataStatus_observable' |
            '_availableNumberItemsOnPage_observable' |
            '_setPagination_action'>(this, {
            _pagination_observable: observable.ref,
            _dataStatus_observable: observable.ref,
            _availableNumberItemsOnPage_observable: observable.ref,
            _setPagination_action: action,
            setOptions: action,
            destroy: action,
            setAvailableNumberItemsOnPage: action,
            itemsOnCurrentPage: computed,
            currentPage: computed,
            availableNumberItemsOnPage: computed,
            maxPages: computed,
            numberItemsPerPage: computed,
            totalItems: computed
        });
    }
}
