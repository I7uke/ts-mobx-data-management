import React from "react";
import AbstractStoreFilters from "./abstractStoreFilters";
import StoreDisplayedData from "./storeDisplayedData";
import StoreDataSource, { DataSourceItem } from "./storeDataSource";
export type InitDataAbstractStoreEditItemsPageContent<TItem extends DataSourceItem> = {
    readonly getNewItem: () => TItem;
    readonly uniquePageKey: string;
};
export default abstract class AbstractStoreEditItemsPageContent<TItem extends DataSourceItem, TStoreEditItem> {
    protected readonly _getNewItem: () => TItem;
    private readonly _uniquePageKey;
    private _uniqueUuid;
    protected _getUniqueUuid(): string;
    getUniquePageKey(): string;
    protected readonly _storeDataSource: StoreDataSource<TItem>;
    readonly storeDisplayedData: StoreDisplayedData<TItem>;
    private _storeEditItem_observable?;
    protected _setStoreEditItem(inputStore: TStoreEditItem | undefined): void;
    protected _destroyStoreEditItem(): void;
    get storeEditItem(): TStoreEditItem | undefined;
    protected _validationItemsList(itemsList: unknown[]): TItem[];
    editItem(id: string): undefined;
    deleteItem(id: string): undefined;
    getItemInfo(id: string): undefined;
    eventStartEditItem(e: React.MouseEvent<HTMLElement, MouseEvent>): void;
    eventStartAddNewItem(): void;
    eventStartDeleteItem(e: React.MouseEvent<HTMLElement, MouseEvent>): void;
    eventGetItemInfo(e: React.MouseEvent<HTMLElement, MouseEvent>): void;
    eventDestroyItemEditor(): void;
    eventUpdateDisplayedData(): void;
    protected _getItemByDataAttribute(element: HTMLElement): TItem | undefined;
    protected abstract _validationItem(item: unknown): TItem | undefined;
    protected abstract _eventEditItem(item: TItem, isNew: boolean): void;
    protected abstract _eventDeleteItem(item: TItem): void;
    protected abstract _eventGetItemInfo(item: TItem): void;
    protected abstract _serverRequestDeleteItem(item: unknown): void;
    protected abstract _serverRequestSaveChangedItem(item: unknown): void;
    protected abstract _serverRequestSaveNewItem(item: unknown): void;
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
