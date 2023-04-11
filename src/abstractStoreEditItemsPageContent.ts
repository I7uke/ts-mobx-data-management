import React from "react";
import {action, computed, makeObservable, observable} from "mobx";
import AbstractStoreFilters from "./abstractStoreFilters";
import StoreDisplayedData from "./storeDisplayedData";
import StoreDataSource, {DataSourceItem, ListenerChangeDataSource} from "./storeDataSource";

export type InitDataAbstractStoreEditItemsPageContent<TItem extends DataSourceItem> = {
    readonly getNewItem: () => TItem;
    readonly uniquePageKey: string;
}

export default abstract class AbstractStoreEditItemsPageContent<TItem extends DataSourceItem, TStoreEditItem> {
    protected readonly _getNewItem: () => TItem;
    private readonly _uniquePageKey: string;

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
    private _listenerChangeDataSource(params:ListenerChangeDataSource<TItem>){
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

    protected _addAutoUpdateDisplayedData() {
        this._storeDataSource.addListenerChangeDataSource(this._listenerChangeDataSource);
    }

    protected _removeAutoUpdateDisplayedData() {
        this._storeDataSource.removeListenerChangeDataSource(this._listenerChangeDataSource);
    }
    //endregion

    //region Добавить фильтр
    protected _addDataSourceFilter() {
        this._storeDataSource.setFilter(this.storeFilters.applyFilters);
    }

    protected _removeDataSourceFilter() {
        this._storeDataSource.removeFilter();
    }
    //endregion

    protected constructor(initData: InitDataAbstractStoreEditItemsPageContent<TItem>) {
        this.eventStartEditItem = this.eventStartEditItem.bind(this);
        this.eventStartAddNewItem = this.eventStartAddNewItem.bind(this);
        this.eventStartDeleteItem = this.eventStartDeleteItem.bind(this);
        this.eventGetItemInfo = this.eventGetItemInfo.bind(this);
        this.eventDestroyItemEditor = this.eventDestroyItemEditor.bind(this);
        this.eventUpdateDisplayedData = this.eventUpdateDisplayedData.bind(this);
        this._listenerChangeDataSource = this._listenerChangeDataSource.bind(this);

        this._storeEditItem_observable = undefined;
        this._getNewItem = initData.getNewItem;
        this._uniquePageKey = initData.uniquePageKey;
        this._storeDataSource = new StoreDataSource<TItem>();
        this.storeDisplayedData = new StoreDisplayedData<TItem>();


        makeObservable<this,
            '_storeEditItem_observable'
            | '_setStoreEditItem'
            | '_destroyStoreEditItem'>(this, {
            _storeEditItem_observable: observable.ref,
            _setStoreEditItem: action,
            _destroyStoreEditItem: action,
            storeEditItem: computed,
        });
    }
}

