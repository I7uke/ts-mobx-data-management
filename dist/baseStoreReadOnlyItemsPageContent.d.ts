import React from "react";
import { BaseStoreFilters, DataSourceItem, InitStoreDisplayedData, StoreDataSource, StoreDisplayedData } from "./index";
export type InitDataBaseStoreReadOnlyItemsPageContent<TItem extends DataSourceItem> = {
    readonly getNewItem: () => TItem;
    readonly uniquePageKey: string;
    readonly itemDataAttribute?: string;
};
export default class BaseStoreReadOnlyItemsPageContent<TItem extends DataSourceItem, TStoreFilters extends BaseStoreFilters<TItem>> {
    protected readonly _getNewItem: () => TItem;
    protected readonly _uniquePageKey: string;
    private _uniqueUuid;
    private readonly _itemDataAttribute;
    protected _getUniqueUuid(): string;
    getUniquePageKey(): string;
    protected readonly _storeDataSource: StoreDataSource<TItem>;
    readonly storeDisplayedData: StoreDisplayedData<TItem>;
    private _detailInfoAboutItem_observable?;
    /**
     * Установить элемент, для детального просмотра
     * @param item
     * @protected
     */
    protected _setDetailInfoAboutItem(item: TItem | undefined): void;
    /**
     * Забыть текущий выбранный элемент для детального просмотра
     * @protected
     */
    protected _resetDetailInfoAboutItem(): void;
    /**
     * Детальная информация о выбранном элементе
     */
    get detailInfoAboutItem(): TItem | undefined;
    protected _getDetailInfoAboutItem(): TItem | undefined;
    protected _validationItemsList(itemsList: unknown[]): TItem[];
    /**
     * Получить информацию о элементе
     * @param id - id элемента
     */
    startGetItemInfo(id: string): void;
    /**
     * Событие получить информацию об элементе
     * @param e
     */
    eventStartGetItemInfo(e: React.MouseEvent<HTMLElement, MouseEvent>): void;
    /**
     * Событие, забыть текущий выбранный элемент для детального просмотра
     */
    eventResetDetailInfoAboutItem(): void;
    /**
     * Обновить отображаемые данные
     */
    eventUpdateDisplayedData(): void;
    protected _getItemByDataAttribute(element: HTMLElement): TItem | undefined;
    private _storeFilters?;
    /**
     * Получить StoreFilters
     * Если StoreFilters не задан вызовет ошибку
     */
    get storeFilters(): TStoreFilters;
    /**
     * Получить StoreFilters
     * Если StoreFilters не задан вызовет ошибку
     * @protected
     */
    protected _getStoreFilters(): TStoreFilters;
    /**
     * Установить StoreFilters
     * Можно установить только раз, если store еще не создан
     * @param store
     * @protected
     */
    protected _setStoreFilters(store: TStoreFilters): void;
    protected _validationItemOverride(item: unknown, existingUuid?: string): TItem | undefined;
    protected _serverRequestGetInitDataOverride(): void;
    /**
     * Получить информацию об элементе
     * @param item
     * @protected
     */
    protected _eventGetItemInfoOverride(item: TItem): void;
    /**
     * Получить данные инициализации для StoreDisplayedData
     * @protected
     */
    protected _getInitDataForStoreDisplayedDataOverride(): InitStoreDisplayedData<TItem>;
    /**
     * Запрос на сервер, получить начальное состояние хранилища
     */
    serverRequestGetInitData(): void;
    private _defaultListenerChangeDataSource;
    protected _addAutoUpdateDisplayedDataDefault(): void;
    protected _removeAutoUpdateDisplayedDataDefault(): void;
    /**
     * Добавить фильтр источнику данных
     * @protected
     */
    protected _addDataSourceFilterDefault(): void;
    /**
     * Удалить фильтр источника данных
     * @protected
     */
    protected _removeDataSourceFilterDefault(): void;
    private _error_observable?;
    protected _setError(error: string): void;
    protected _removeError(): void;
    get error(): string | undefined;
    /**
     * Ссылка для перенаправления
     */
    private _redirectLink_observable;
    /**
     * Установить ссылку для перенаправления
     * @param link
     * @protected
     */
    protected _setRedirectLink(link: string): void;
    /**
     * Ссылка для перенаправления
     */
    get redirectLink(): string;
    constructor(initData: InitDataBaseStoreReadOnlyItemsPageContent<TItem>);
}
