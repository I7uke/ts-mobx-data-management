import { DataSourceItem } from "./index";
type DataStatus = 'notSet' | 'empty' | 'installed';
type CallbackForceUpdate<TItem extends DataSourceItem> = () => TItem[];
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
     * Возможные колличества элементов на странице
     */
    readonly availableNumberItemsOnPage: number[];
}
export type InitStoreDisplayedData<TItem extends DataSourceItem> = {
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
     * ВАЖНО! отсчет идет с 1
     */
    readonly currentPage: number;
};
export default class StoreDisplayedData<TItem extends DataSourceItem> {
    private _itemsList;
    private _pagination_observable;
    private _callbackForceUpdate?;
    private _setPagination_action;
    private _dataStatus_observable;
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
     * Очищает все переданные данные
     * Будет возвравщен в первоначальное состояние
     */
    destroy(): void;
    /**
     * Установить параметры
     * Будут учитываться только переданные поля
     * Если поле отсутствует то будет сохранено текущее значение этого поля
     * @param params
     */
    setOptions(params: Partial<GetPaginationParams<TItem>>): void;
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
     * Возможные колличества элементов на странице
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
    constructor(init?: InitStoreDisplayedData<TItem>);
}
export {};
