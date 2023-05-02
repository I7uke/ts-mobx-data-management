import React from "react";
import { CallbackSaveModifiedItemParams } from "./abstractStoreEditItem";
import AbstractStoreFilters from "./abstractStoreFilters";
import StoreDisplayedData from "./storeDisplayedData";
import StoreDataSource, { DataSourceItem } from "./storeDataSource";
export type InitDataAbstractStoreEditItemsPageContent<TItem extends DataSourceItem> = {
    readonly getNewItem: () => TItem;
    readonly uniquePageKey: string;
    readonly itemDataAttribute?: string;
};
export default abstract class AbstractStoreEditItemsPageContent<TItem extends DataSourceItem, TStoreEditItem> {
    protected readonly _getNewItem: () => TItem;
    private readonly _uniquePageKey;
    private _uniqueUuid;
    private readonly _itemDataAttribute;
    protected _getUniqueUuid(): string;
    getUniquePageKey(): string;
    protected readonly _storeDataSource: StoreDataSource<TItem>;
    readonly storeDisplayedData: StoreDisplayedData<TItem>;
    private _storeEditItem_observable?;
    protected _setStoreEditItem(inputStore: TStoreEditItem | undefined): void;
    protected _destroyStoreEditItem(): void;
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
    eventGetItemInfo(e: React.MouseEvent<HTMLElement, MouseEvent>): void;
    /**
     * Уничтожить редактор
     */
    eventDestroyItemEditor(): void;
    /**
     * Обновить отображаемые данные
     */
    eventUpdateDisplayedData(): void;
    /**
     * Получить информацию об элементе
     * @param item
     * @protected
     */
    protected _eventGetItemInfo(item: TItem): void;
    protected _getItemByDataAttribute(element: HTMLElement): TItem | undefined;
    protected abstract _validationItem(item: unknown): TItem | undefined;
    protected abstract _eventEditItem(item: TItem, isNew: boolean): void;
    protected abstract _eventDeleteItem(item: TItem): void;
    protected abstract _serverRequestDeleteItem(item: unknown, other?: unknown): void;
    protected abstract _serverRequestSaveChangedItem(item: unknown, other?: unknown): void;
    protected abstract _serverRequestSaveNewItem(item: unknown, other?: unknown): void;
    abstract readonly storeFilters: Object & AbstractStoreFilters<TItem>;
    abstract serverRequestGetInitData(): void;
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
    protected saveModifiedItemDefault(param: CallbackSaveModifiedItemParams<TItem>): void;
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
    protected constructor(initData: InitDataAbstractStoreEditItemsPageContent<TItem>);
}
