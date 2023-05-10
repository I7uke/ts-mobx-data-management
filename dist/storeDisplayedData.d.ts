import { DataSourceItem } from "./index";
type CurrentPageType = number | 'firstPage' | 'lastPage';
type DataStatus = 'notSet' | 'empty' | 'installed';
type CallbackForceUpdate<TItem extends DataSourceItem> = () => TItem[];
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
};
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
};
export default class StoreDisplayedData<TItem extends DataSourceItem> {
    private _internalData;
    private _pagination_observable;
    private _callbackForceUpdate?;
    private _setPagination_action;
    private _dataStatus_observable;
    /**
     * Возможные количества элементов на странице
     */
    private _availableNumberItemsOnPage_observable;
    setAvailableNumberItemsOnPage(itemsList: number[]): void;
    /**
     * Установить список элементов без триггеров
     * Данная установка не вызовет обновления данных в визуальном представлении
     * @param itemsList
     */
    setItemsListWithoutTriggers(itemsList: TItem[]): void;
    /**
     * Применить принудительное обновление
     * После применения
     * @private
     */
    private _applyCallbackForceUpdate;
    /**
     * Установить callback принудительного обновления
     * callback будет вызван при изменении данных в методах: setOptions, eventShowPrevPage, eventShowNextPage
     * @param callback
     */
    setForceUpdate(callback: CallbackForceUpdate<TItem>): void;
    /**
     * Удалить callback принудительного обновления
     */
    removeForceUpdate(): void;
    /**
     * Очищает все переданные данные.
     * Будет возвращен в первоначальное состояние
     */
    destroy(): void;
    /**
     * Установить параметры
     * Будут учитываться только переданные поля
     * Если поле отсутствует то будет сохранено текущее значение этого поля
     * @param params
     */
    setOptions(params: SetOptionsParams<TItem>): void;
    /**
     * Статус данных
     */
    get dataStatus(): DataStatus;
    /**
     * Элементы на текущей странице
     */
    get itemsOnCurrentPage(): TItem[];
    /**
     * Текущая страница
     */
    get currentPage(): number;
    /**
     * Возможные количества элементов на странице
     */
    get availableNumberItemsOnPage(): number[];
    /**
     * Максимальное количество доступных страниц
     */
    get maxPages(): number;
    /**
     * Количество элементов на одной странице
     */
    get numberItemsPerPage(): number;
    /**
     * Общее количество элементов
     */
    get totalItems(): number;
    /**
     * Показать следующую страницу
     */
    eventShowNextPage(): void;
    /**
     * Показать предыдущую страницу
     */
    eventShowPrevPage(): void;
    private _changeInternalData;
    constructor(initData?: InitStoreDisplayedData<TItem>);
}
export {};
