import React from "react";
import {action, computed, makeObservable, observable} from "mobx";
import {CallbackSaveModifiedItemParams} from "./abstractStoreEditItem";
import AbstractStoreFilters from "./abstractStoreFilters";
import StoreDisplayedData from "./storeDisplayedData";
import StoreDataSource, {DataSourceItem, ListenerChangeDataSource} from "./storeDataSource";
import UniqueUuid from "./uniqueUuid";

export type InitDataAbstractStoreEditItemsPageContent<TItem extends DataSourceItem> = {
    readonly getNewItem: () => TItem;
    readonly uniquePageKey: string;
    readonly itemDataAttribute?: string;
}

export default abstract class AbstractStoreEditItemsPageContent<TItem extends DataSourceItem, TStoreEditItem> {
    protected readonly _getNewItem: () => TItem;
    private readonly _uniquePageKey: string;
    private _uniqueUuid: UniqueUuid;
    private readonly _itemDataAttribute: string;

    protected _getUniqueUuid(): string {
        return this._uniqueUuid.getUuid();
    }

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

    //region Действия над элементом (не события)
    /**
     * Начать изменение элемента
     * @param id - id элемента
     */
    public startEditItem(id: string): void {
        const targetItem = this._storeDataSource.getItemByUuid(id);

        if (!targetItem) {
            return;
        }

        this._eventEditItem(targetItem, false);
    }

    /**
     * Начать удаление элемента
     * @param id - id элемента
     */
    public startDeleteItem(id: string): void {
        const targetItem = this._storeDataSource.getItemByUuid(id);

        if (!targetItem) {
            return;
        }

        this._eventDeleteItem(targetItem);
    }

    /**
     * Получить информацию о элементе
     * @param id - id элемента
     */
    public startGetItemInfo(id: string): void {
        const targetItem = this._storeDataSource.getItemByUuid(id);

        if (!targetItem) {
            return;
        }

        return this._eventGetItemInfo(targetItem);
    }

    //endregion

    //region События
    /**
     * Событие начать редактировать элемент
     * @param e
     */
    public eventStartEditItem(e: React.MouseEvent<HTMLElement, MouseEvent>): void {
        const targetItem = this._getItemByDataAttribute(e.currentTarget);

        if (!targetItem) {
            return;
        }

        this._eventEditItem(targetItem, false);
    }

    /**
     * Событие начать добавление нового элемента
     */
    public eventStartAddNewItem(): void {
        const newItem: TItem = this._getNewItem();
        this._eventEditItem(newItem, true);
    }

    /**
     * Событие начать удаление элемента
     * @param e
     */
    public eventStartDeleteItem(e: React.MouseEvent<HTMLElement, MouseEvent>): void {
        const targetItem = this._getItemByDataAttribute(e.currentTarget);

        if (!targetItem) {
            return;
        }

        this._eventDeleteItem(targetItem);
    }

    /**
     * Событие получить информацию об элементе
     * @param e
     */
    public eventGetItemInfo(e: React.MouseEvent<HTMLElement, MouseEvent>): void {
        const targetItem = this._getItemByDataAttribute(e.currentTarget);

        if (!targetItem) {
            return;
        }

        this._eventGetItemInfo(targetItem);
    }

    /**
     * Уничтожить редактор
     */
    public eventDestroyItemEditor(): void {
        this._setStoreEditItem(undefined);
    }

    /**
     * Обновить отображаемые данные
     */
    public eventUpdateDisplayedData(): void {
        const itemsList = this._storeDataSource.itemsList;
        this.storeDisplayedData.setOptions({
            itemsList: itemsList,
        });
    }

    /**
     * Получить информацию об элементе
     * @param item
     * @protected
     */
    protected _eventGetItemInfo(item: TItem): void {
    }

    //endregion

    //region Получить элемент по data attribute
    protected _getItemByDataAttribute(element: HTMLElement): TItem | undefined {
        const uuid: string | null = element.getAttribute(this._itemDataAttribute);

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

    protected abstract _serverRequestDeleteItem(item: unknown, other?: unknown): void;

    protected abstract _serverRequestSaveChangedItem(item: unknown, other?: unknown): void;

    protected abstract _serverRequestSaveNewItem(item: unknown, other?: unknown): void;

    public abstract readonly storeFilters: Object & AbstractStoreFilters<TItem>;

    public abstract serverRequestGetInitData(): void;

    //endregion

    //region Слушатель изменение данных
    private _defaultListenerChangeDataSource(params: ListenerChangeDataSource<TItem>) {
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

    protected saveModifiedItemDefault(param:CallbackSaveModifiedItemParams<TItem>){
        if(param.status === 'newItem') {
            this._serverRequestSaveNewItem(param.item, param.other);
            return;
        }

        if(param.status === 'existingItem') {
            this._serverRequestSaveChangedItem(param.item, param.other);
            return;
        }
    }

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
        if (typeof link !== 'string') {
            this._redirectLink_observable = '';
            return;
        }

        this._redirectLink_observable = link;
    }

    /**
     * Ссылка для перенаправления
     */
    get redirectLink() {
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
        this.saveModifiedItemDefault = this.saveModifiedItemDefault.bind(this);

        this._storeEditItem_observable = undefined;
        this._redirectLink_observable = '';
        this._getNewItem = initData.getNewItem;
        this._uniquePageKey = initData.uniquePageKey;
        this._storeDataSource = new StoreDataSource<TItem>();
        this.storeDisplayedData = new StoreDisplayedData<TItem>();
        this._uniqueUuid = new UniqueUuid();

        let itemDataAttribute: string = 'data-uuid';

        if (typeof initData.itemDataAttribute === 'string') {
            if (initData.itemDataAttribute.length > 5) {
                itemDataAttribute = initData.itemDataAttribute;
            }
        }

        this._itemDataAttribute = itemDataAttribute;

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

