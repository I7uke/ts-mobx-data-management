import React from "react";
import {action, computed, makeObservable, observable} from "mobx";
import AbstractStoreFilters from "./abstractStoreFilters";
import StoreDisplayedData from "./storeDisplayedData";
import StoreDataSource, {DataSourceItem, ListenerChangeDataSource} from "./storeDataSource";
import UniqueUuid from "./uniqueUuid";

export type InitDataAbstractStoreEditItemsPageContent<TItem extends DataSourceItem> = {
    readonly getNewItem: () => TItem;
    readonly uniquePageKey: string;
}

export default abstract class AbstractStoreEditItemsPageContent<TItem extends DataSourceItem, TStoreEditItem> {
    protected readonly _getNewItem: () => TItem;
    private readonly _uniquePageKey: string;
    protected _uniqueUuid: UniqueUuid;

    public getUniquePageKey() {
        return this._uniquePageKey;
    }

    protected readonly _storeDataSource: StoreDataSource<TItem>;
    public readonly storeDisplayedData: StoreDisplayedData<TItem>;

    //region Редактирование элемента
    private _storeEditItem_observable?: TStoreEditItem;

    protected _setStoreEditItem(inputStore: TStoreEditItem | undefined) {
        this._storeEditItem_observable = inputStore;
    }

    protected _destroyStoreEditItem() {
        this._storeEditItem_observable = undefined;
    }

    get storeEditItem() {
        return this._storeEditItem_observable;
    }

    //endregion

    //region Проверить элемент
    protected _validationItemsList(itemsList: unknown[]): TItem[] {
        const result: TItem[] = [];

        if (!itemsList.length) {
            return result;
        }

        for (const item of itemsList) {
            const validItem = this._validationItem(item);
            if (validItem) {
                result.push(validItem);
            }
        }

        return result;
    }
    //endregion

    public editItem(id: string){
        const targetItem = this._storeDataSource.getItemByUuid(id);

        if (!targetItem) {
            return undefined;
        }

        this._eventEditItem(targetItem, false);
    }

    public deleteItem(id: string){
        const targetItem = this._storeDataSource.getItemByUuid(id);

        if (!targetItem) {
            return undefined;
        }

        this._eventDeleteItem(targetItem);
    }

    public getItemInfo(id: string) {
        const targetItem = this._storeDataSource.getItemByUuid(id);

        if (!targetItem) {
            return undefined;
        }

        this._eventGetItemInfo(targetItem);
    }

    //region События
    public eventStartEditItem(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        const targetItem = this._getItemByDataAttribute(e.currentTarget);

        if (!targetItem) {
            return;
        }

        this._eventEditItem(targetItem, false);
    }

    public eventStartAddNewItem() {
        const newItem: TItem = this._getNewItem();
        this._eventEditItem(newItem, true);
    }

    public eventStartDeleteItem(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        const targetItem = this._getItemByDataAttribute(e.currentTarget);

        if (!targetItem) {
            return;
        }

        this._eventDeleteItem(targetItem);
    }

    public eventGetItemInfo(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        const targetItem = this._getItemByDataAttribute(e.currentTarget);

        if (!targetItem) {
            return;
        }

        this._eventGetItemInfo(targetItem);
    }

    public eventDestroyItemEditor() {
        this._setStoreEditItem(undefined);
    }

    public eventUpdateDisplayedData() {
        const itemsList = this._storeDataSource.itemsList;
        this.storeDisplayedData.setOptions({
            itemsList: itemsList,
        });
    }

    //endregion

    //region Получить элемент по data attribute
    protected _getItemByDataAttribute(element: HTMLElement): TItem | undefined {
        const uuid: string | null = element.getAttribute('data-uuid');

        if (typeof uuid !== 'string') {
            return undefined;
        }

        const targetItem = this._storeDataSource.getItemByUuid(uuid);

        if (!targetItem) {
            return undefined;
        }

        return targetItem;
    }

    //endregion

    //region abstract
    protected abstract _validationItem(item: unknown): TItem | undefined;

    protected abstract _eventEditItem(item: TItem, isNew: boolean): void;

    protected abstract _eventDeleteItem(item: TItem): void;

    protected abstract _eventGetItemInfo(item: TItem): void;

    protected abstract _serverRequestDeleteItem(item: unknown): void;

    protected abstract _serverRequestSaveChangedItem(item: unknown): void;

    protected abstract _serverRequestSaveNewItem(item: unknown): void;

    public abstract readonly storeFilters: Object & AbstractStoreFilters<TItem> ;

    public abstract serverRequestGetInitData(): void;

    //endregion

    //region Слушатель изменение данных
    private _defaultListenerChangeDataSource(params:ListenerChangeDataSource<TItem>){
        if (params.changeType === 'addNewItem') {
            this.storeDisplayedData.setOptions({
                itemsList: params.itemsList,
                currentPage: 1
            });
            return;
        }

        this.storeDisplayedData.setOptions({
            itemsList: params.itemsList
        });
    }

    protected _addAutoUpdateDisplayedDataDefault() {
        this._storeDataSource.addListenerChangeDataSource(this._defaultListenerChangeDataSource);
    }

    protected _removeAutoUpdateDisplayedDataDefault() {
        this._storeDataSource.removeListenerChangeDataSource(this._defaultListenerChangeDataSource);
    }
    //endregion

    //region Добавить фильтр
    /**
     * Добавить фильтр источнику данных
     * @protected
     */
    protected _addDataSourceFilterDefault() {
        this._storeDataSource.setFilter(this.storeFilters.applyFilters);
    }

    /**
     * Удалить фильтр источника данных
     * @protected
     */
    protected _removeDataSourceFilterDefault() {
        this._storeDataSource.removeFilter();
    }
    //endregion

    /**
     * Ссылка для перенаправления
     */
    private _redirectLink_observable: string;

    /**
     * Установить ссылку для перенаправления
     * @param link
     * @protected
     */
    protected _setRedirectLink(link: string) {
        if(typeof link !== 'string'){
            this._redirectLink_observable = '';
            return;
        }

        this._redirectLink_observable = link;
    }

    /**
     * Ссылка для перенаправления
     */
    get redirectLink(){
        return this._redirectLink_observable;
    }

    protected constructor(initData: InitDataAbstractStoreEditItemsPageContent<TItem>) {
        this.eventStartEditItem = this.eventStartEditItem.bind(this);
        this.eventStartAddNewItem = this.eventStartAddNewItem.bind(this);
        this.eventStartDeleteItem = this.eventStartDeleteItem.bind(this);
        this.eventGetItemInfo = this.eventGetItemInfo.bind(this);
        this.eventDestroyItemEditor = this.eventDestroyItemEditor.bind(this);
        this.eventUpdateDisplayedData = this.eventUpdateDisplayedData.bind(this);
        this._defaultListenerChangeDataSource = this._defaultListenerChangeDataSource.bind(this);

        this._storeEditItem_observable = undefined;
        this._redirectLink_observable = '';
        this._getNewItem = initData.getNewItem;
        this._uniquePageKey = initData.uniquePageKey;
        this._storeDataSource = new StoreDataSource<TItem>();
        this.storeDisplayedData = new StoreDisplayedData<TItem>();
        this._uniqueUuid = new UniqueUuid();

        makeObservable<this,
            '_storeEditItem_observable'
            | '_setStoreEditItem'
            | '_destroyStoreEditItem'
            | '_redirectLink_observable'
            | '_setRedirectLink'>(this, {
            _storeEditItem_observable: observable.ref,
            _redirectLink_observable: observable.ref,
            _setStoreEditItem: action,
            _destroyStoreEditItem: action,
            _setRedirectLink: action,
            storeEditItem: computed,
            redirectLink: computed
        });
    }
}

