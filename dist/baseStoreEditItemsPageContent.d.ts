import React from "react";
import { BaseStoreFilters, CallbackSaveModifiedItemParams, DataSourceItem, InitStoreDisplayedData, StoreDataSource, StoreDisplayedData } from "./index";
export type InitDataBaseStoreEditItemsPageContent<TItem extends DataSourceItem> = {
    readonly getNewItem: () => TItem;
    readonly uniquePageKey: string;
    readonly itemDataAttribute?: string;
};
export default class BaseStoreEditItemsPageContent<TItem extends DataSourceItem, TStoreEditItem, TStoreFilters extends BaseStoreFilters<TItem>> {
    protected readonly _getNewItem: () => TItem;
    protected readonly _uniquePageKey: string;
    private _uniqueUuid;
    private readonly _itemDataAttribute;
    protected _getUniqueUuid(): string;
    getUniquePageKey(): string;
    protected readonly _storeDataSource: StoreDataSource<TItem>;
    readonly storeDisplayedData: StoreDisplayedData<TItem>;
    private _storeEditItem_observable?;
    protected _setStoreEditItem(inputStore: TStoreEditItem | undefined): void;
    protected _destroyStoreEditItem(): void;
    protected _getStoreEditItem(): TStoreEditItem | undefined;
    get storeEditItem(): TStoreEditItem | undefined;
    protected _validationItemsList(itemsList: unknown[]): TItem[];
    /**
     * Начать изменение элемента
     * @param id - id элемента
     */
    startEditItem(id: string): void;
    /**
     * Начать удаление элемента
     * @param id - id элемента
     */
    startDeleteItem(id: string): void;
    /**
     * Получить информацию о элементе
     * @param id - id элемента
     */
    startGetItemInfo(id: string): void;
    /**
     * Событие начать редактировать элемент
     * @param e
     */
    eventStartEditItem(e: React.MouseEvent<HTMLElement, MouseEvent>): void;
    /**
     * Событие начать добавление нового элемента
     */
    eventStartAddNewItem(): void;
    /**
     * Событие начать удаление элемента
     * @param e
     */
    eventStartDeleteItem(e: React.MouseEvent<HTMLElement, MouseEvent>): void;
    /**
     * Событие получить информацию об элементе
     * @param e
     */
    eventStartGetItemInfo(e: React.MouseEvent<HTMLElement, MouseEvent>): void;
    /**
     * Уничтожить редактор
     */
    eventDestroyItemEditor(): void;
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
    /**
     * Возвращает текст подтверждения при удалении элемента
     * @param item
     * @protected
     */
    protected _getDeleteItemConfirmTextOverride(item: TItem): string;
    protected _validationItemOverride(item: unknown, existingUuid?: string): TItem | undefined;
    protected _eventEditItemOverride(item: TItem, isNew: boolean): void;
    protected _eventDeleteItemOverride(item: TItem): void;
    protected _serverRequestDeleteItemOverride(item: unknown, other?: unknown): void;
    protected _serverRequestSaveChangedItemOverride(item: unknown, other?: unknown): void;
    protected _serverRequestSaveNewItemOverride(item: unknown, other?: unknown): void;
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
    eventSaveModifiedItemDefault(param: CallbackSaveModifiedItemParams<TItem>): void;
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
    constructor(initData: InitDataBaseStoreEditItemsPageContent<TItem>);
}
