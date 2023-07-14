import React from "react";
import {action, computed, makeObservable, observable} from "mobx";
import {
    BaseStoreFilters, CallbackSaveModifiedItemParams,
    DataSourceItem, InitStoreDisplayedData,
    ListenerChangeDataSource,
    StoreDataSource,
    StoreDisplayedData,
    UniqueUuid
} from "./index";

export type InitDataBaseStoreEditItemsPageContent<TItem extends DataSourceItem> = {
    readonly getNewItem: () => TItem;
    readonly uniquePageKey: string;
    readonly itemDataAttribute?: string;
}

export default class BaseStoreEditItemsPageContent<TItem extends DataSourceItem, TStoreEditItem, TStoreFilters extends BaseStoreFilters<TItem>> {
    protected readonly _getNewItem: () => TItem;
    protected readonly _uniquePageKey: string;
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

    protected _getStoreEditItem(): TStoreEditItem | undefined {
        return this._storeEditItem_observable;
    }

    get storeEditItem(): TStoreEditItem | undefined {
        return this._storeEditItem_observable;
    }

    //endregion

    //region Детальная информация об элементе
    private _detailInfoAboutItem_observable?: TItem;

    /**
     * Установить элемент, для детального просмотра
     * @param item
     * @protected
     */
    protected _setDetailInfoAboutItem(item: TItem | undefined) {
        this._detailInfoAboutItem_observable = item;
    }

    /**
     * Забыть текущий выбранный элемент для детального просмотра
     * @protected
     */
    protected _resetDetailInfoAboutItem() {
        this._detailInfoAboutItem_observable = undefined;
    }

    /**
     * Детальная информация о выбранном элементе
     */
    get detailInfoAboutItem(): TItem | undefined {
        return this._detailInfoAboutItem_observable;
    }

    protected _getDetailInfoAboutItem(): TItem | undefined {
        return this._detailInfoAboutItem_observable;
    }

    //endregion

    //region Проверить элемент
    protected _validationItemsList(itemsList: unknown[]): TItem[] {
        const result: TItem[] = [];

        if (!itemsList.length) {
            return result;
        }

        for (const item of itemsList) {
            const validItem: TItem | undefined = this._validationItemOverride(item);
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

        this._eventEditItemOverride(targetItem, false);
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

        this._eventDeleteItemOverride(targetItem);
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

        this._eventGetItemInfoOverride(targetItem);
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

        this._eventEditItemOverride(targetItem, false);
    }

    /**
     * Событие начать добавление нового элемента
     */
    public eventStartAddNewItem(): void {
        const newItem: TItem = this._getNewItem();
        this._eventEditItemOverride(newItem, true);
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

        this._eventDeleteItemOverride(targetItem);
    }

    /**
     * Событие получить информацию об элементе
     * @param e
     */
    public eventStartGetItemInfo(e: React.MouseEvent<HTMLElement, MouseEvent>): void {
        const targetItem = this._getItemByDataAttribute(e.currentTarget);

        if (!targetItem) {
            return;
        }

        this._eventGetItemInfoOverride(targetItem);
    }

    /**
     * Событие, забыть текущий выбранный элемент для детального просмотра
     */
    public eventResetDetailInfoAboutItem() {
        this._setDetailInfoAboutItem(undefined);
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

    //region StoreFilters
    private _storeFilters?: TStoreFilters;

    /**
     * Получить StoreFilters
     * Если StoreFilters не задан вызовет ошибку
     */
    get storeFilters(): TStoreFilters {
        if (!this._storeFilters) {
            throw new Error('storeFilters not created');
        }

        return this._storeFilters;
    }

    /**
     * Получить StoreFilters
     * Если StoreFilters не задан вызовет ошибку
     * @protected
     */
    protected _getStoreFilters(): TStoreFilters {
        if (!this._storeFilters) {
            throw new Error('storeFilters not created');
        }

        return this._storeFilters;
    }

    /**
     * Установить StoreFilters
     * Можно установить только раз, если store еще не создан
     * @param store
     * @protected
     */
    protected _setStoreFilters(store: TStoreFilters) {
        if (this._storeFilters) {
            return;
        }

        this._storeFilters = store;
    }

    //endregion

    //region Методы для переопределения

    /**
     * Возвращает текст подтверждения при удалении элемента
     * @param item
     * @protected
     */
    protected _getDeleteItemConfirmTextOverride(item: TItem): string {
        return 'Удалить элемент ?';
    }

    protected _validationItemOverride(item: unknown, existingUuid?: string): TItem | undefined {
        throw new Error('method _validationItemOverride must be override');
    }

    protected _eventEditItemOverride(item: TItem, isNew: boolean): void {
        throw new Error('method _eventEditItemOverride must be override');
    }

    protected _eventDeleteItemOverride(item: TItem): void {
        throw new Error('method _eventDeleteItemOverride must be override');
    }

    protected _serverRequestDeleteItemOverride(item: unknown, other?: unknown): void {
        throw new Error('method _serverRequestDeleteItemOverride must be override');
    }

    protected _serverRequestSaveChangedItemOverride(item: unknown, other?: unknown): void {
        throw new Error('method _serverRequestSaveChangedItemOverride must be override');
    }

    protected _serverRequestSaveNewItemOverride(item: unknown, other?: unknown): void {
        throw new Error('method _serverRequestSaveNewItemOverride must be override');
    }

    protected _serverRequestGetInitDataOverride(): void {
        throw new Error('method _serverRequestGetInitDataOverride must be override');
    }

    /**
     * Получить информацию об элементе
     * @param item
     * @protected
     */
    protected _eventGetItemInfoOverride(item: TItem): void {
        if (!item) {
            return;
        }

        this._setDetailInfoAboutItem(item);
    }

    /**
     * Получить данные инициализации для StoreDisplayedData
     * @protected
     */
    protected _getInitDataForStoreDisplayedDataOverride(): InitStoreDisplayedData<TItem> {
        return {
            itemsList: [],
            numberItemsPerPage: 10,
            currentPage: 1
        };
    }

    //endregion

    /**
     * Запрос на сервер, получить начальное состояние хранилища
     */
    public serverRequestGetInitData(): void {
        this._serverRequestGetInitDataOverride();
    }

    //region Слушатель изменение данных
    private _defaultListenerChangeDataSource(params: ListenerChangeDataSource<TItem>) {
        if (params.changeType === 'addNewItem') {
            this.storeDisplayedData.setOptions({
                itemsList: params.itemsList,
                currentPage: 'lastPage'
            });

            return;
        }

        if (params.changeType === 'editItem' || params.changeType === 'deleteItem') {
            this.storeDisplayedData.setOptions({
                itemsList: params.itemsList
            });

            return;
        }

        this.storeDisplayedData.setOptions({
            itemsList: params.itemsList,
            currentPage: 1
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
        if (!this._storeFilters) {
            throw new Error('storeFilters not created');
        }

        // Добавляем фильтрацию
        this._storeDataSource.setFilter(this._storeFilters.applyFilters);

        // Добавляем обновление данных
        this._storeFilters.setCallbackUpdateViewData(() => {
            this.storeDisplayedData.setOptions({
                currentPage: 1,
                itemsList: this._storeDataSource.itemsList
            });
        });
    }

    /**
     * Удалить фильтр источника данных
     * @protected
     */
    protected _removeDataSourceFilterDefault() {
        this._storeDataSource.removeFilter();

        if (this._storeFilters) {
            this._storeFilters.removeCallbackUpdateViewData();
        }
    }

    //endregion

    //region Ошибка
    private _error_observable?: string;

    protected _setError(error: string) {
        if (typeof error !== 'string') {
            return;
        }

        if (!error) {
            return;
        }

        this._error_observable = error;
    }

    protected _removeError() {
        this._error_observable = undefined;
    }

    get error() {
        return this._error_observable;
    }

    //endregion

    public eventSaveModifiedItemDefault(param: CallbackSaveModifiedItemParams<TItem>) {
        if (param.status === 'newItem') {
            this._serverRequestSaveNewItemOverride(param.item, param.other);
            return;
        }

        if (param.status === 'existingItem') {
            this._serverRequestSaveChangedItemOverride(param.item, param.other);
            return;
        }
    }

    //region Ссылка редиректа
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

    //endregion

    /**
    * Вызывать перед удалением store
    */
    public beforeRemovingStore() {
    }

    constructor(initData: InitDataBaseStoreEditItemsPageContent<TItem>) {
        this.eventStartEditItem = this.eventStartEditItem.bind(this);
        this.eventStartAddNewItem = this.eventStartAddNewItem.bind(this);
        this.eventStartDeleteItem = this.eventStartDeleteItem.bind(this);
        this.eventStartGetItemInfo = this.eventStartGetItemInfo.bind(this);
        this.eventDestroyItemEditor = this.eventDestroyItemEditor.bind(this);
        this.eventUpdateDisplayedData = this.eventUpdateDisplayedData.bind(this);
        this.eventResetDetailInfoAboutItem = this.eventResetDetailInfoAboutItem.bind(this);
        this._defaultListenerChangeDataSource = this._defaultListenerChangeDataSource.bind(this);
        this.eventSaveModifiedItemDefault = this.eventSaveModifiedItemDefault.bind(this);
        this.serverRequestGetInitData = this.serverRequestGetInitData.bind(this);

        this._storeEditItem_observable = undefined;
        this._redirectLink_observable = '';
        this._detailInfoAboutItem_observable = undefined;
        this._getNewItem = initData.getNewItem;
        this._uniquePageKey = initData.uniquePageKey;
        this._storeDataSource = new StoreDataSource<TItem>();
        this.storeDisplayedData = new StoreDisplayedData<TItem>(this._getInitDataForStoreDisplayedDataOverride());
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
            | '_setRedirectLink'
            | '_error_observable'
            | '_setError'
            | '_removeError'
            | '_detailInfoAboutItem_observable'
            | '_setDetailInfoAboutItem'
            | '_resetDetailInfoAboutItem'>(this, {
            _storeEditItem_observable: observable.ref,
            _redirectLink_observable: observable.ref,
            _detailInfoAboutItem_observable: observable.ref,
            _error_observable: observable.ref,
            _setStoreEditItem: action,
            _destroyStoreEditItem: action,
            _setRedirectLink: action,
            _setError: action,
            _removeError: action,
            _setDetailInfoAboutItem: action,
            _resetDetailInfoAboutItem: action,
            storeEditItem: computed,
            redirectLink: computed,
            error: computed,
            detailInfoAboutItem: computed
        });
    }
}

