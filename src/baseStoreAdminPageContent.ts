import React from "react";
import {action, computed, makeObservable, observable} from "mobx";
import AbstractStoreEditItem from "./abstractStoreEditItem";
import StoreDisplayedData from "./storeDisplayedData";
import StoreDataDisplay from "./storeDisplayedData";
import StoreDataSource, {DataSourceItem} from "./storeDataSource";





function getItemIdByDataAttribute(element: HTMLElement): string | undefined {
    const uuid: string | null = element.getAttribute('data-uuid');

    if(typeof uuid !== 'string'){
        return undefined;
    }

    return uuid;
}




export type InitDataAbstractStoreEditItemsPageContent<TItem extends DataSourceItem> = {
    readonly getNewItem:()=> TItem;
    readonly uniquePageKey: string;
}


export default abstract class AbstractStoreEditItemsPageContent<TItem extends DataSourceItem, TStoreEditItem> {
    protected readonly _getNewItem: () => TItem;
    private readonly _uniquePageKey: string;

    public getUniquePageKey() {
        return this._uniquePageKey;
    }

    protected readonly _storeDataSource: StoreDataSource<TItem>
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
    protected abstract _validationItem(item: any): TItem | undefined;

    protected _validationItemsList(itemsList: any[]): TItem[] {
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





    protected constructor(initData: InitDataAbstractStoreEditItemsPageContent<TItem>) {
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





    ////////////////////////////////////////////////////



    //region События
    /**
     * Начать изменение элемента
     * @param e
     */
    public eventStartChangeItem(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        const targetItem = this._getItemByDataAttribute(e.currentTarget);

        if (!targetItem) {
            return;
        }

        this._eventStartEditItemOverride(targetItem, false);
    }

    /**
     * Начать удаление элемента
     * @param e
     */
    public eventStartDeleteItem(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        const targetItem = this._getItemByDataAttribute(e.currentTarget);

        if (!targetItem) {
            return;
        }

        this._storeStandardFullScreenPopup.setConfirm({
            componentProps:{
                confirmText: this._getDeleteItemConfirmTextOverride(targetItem),
                eventClose: this._storeStandardFullScreenPopup.closeAllWindows,
                confirmIcoType: 'delete',
                eventConfirm: () => {
                    this._serverRequestDeleteItemOverride(targetItem);
                }
            },
            keyCurrentActivePage: this._pageKey
        });
    }

    /**
     * Начать изменение элемента
     */
    public eventStartAddNewItem() {
        const newEmptyItem: DataItemType = this._getNewEmptyItem();
        this._eventStartEditItemOverride(newEmptyItem, true);
    }

    /**
     * Закрыть окно редактирования
     * @protected
     */
    protected _eventCloseEditor() {
        this._setStoreEditData(undefined);
    }

    /**
     * Событие обновить отображаемые данные
     * @private
     */
    protected _eventUpdateDisplayedData() {
        this.storeDataPagination.updateCurrentDataPagination({
            isResetSelectedItemsOnPage: false,
            isResetSelectedCurrentPage: false,
            dataListForPagination: this._storeDataManager.dataForManage
        });
    }

    /**
     * Событие применить все фильтры и сортировку
     * @param inputData
     * @private
     */
    private _eventApplyAllFiltersAndSorting(inputData: DataItemType[]): DataItemType[] {
        return this._applyAllFiltersAndSortingOverride(inputData);
    }

    //endregion

    //region Методы для переопределения
    /**
     * Возвращает сообщение с вопросом об удалении
     * @param item
     * @protected
     */
    protected _getDeleteItemConfirmTextOverride(item: DataItemType): string {
        return 'Удалить элемент ?';
    }

    /**
     * Начать редактирование элемента
     * @param item
     * @param isNew
     * @protected
     */
    protected _eventStartEditItemOverride(item: DataItemType, isNew: boolean) {
    }

    /**
     * Запрос на сервер, удаление элемента
     * @param itemToRemove
     * @protected
     */
    protected _serverRequestDeleteItemOverride(itemToRemove: DataItemType) {
        this._storeStandardFullScreenPopup.setLoading({
            componentProps:{
                loadingText: 'Удаление элемента'
            },
            keyCurrentActivePage: this._pageKey
        });
    }

    /**
     * Запрос на сервер, изменение элемента
     * @param changeItem - Измененный элемент
     * @param other - Прочие данные
     * @protected
     */
    protected _serverRequestSaveChangeItemOverride(changeItem: DataItemType, other?: any) {
        this._storeStandardFullScreenPopup.setLoading({
            componentProps:{
                loadingText: 'Изменение элемента'
            },
            keyCurrentActivePage: this._pageKey
        });
    }

    /**
     * Запрос на сервер, сохранение нового элемента
     * @param changeItem - Новый измененный элемент
     * @param other - Прочие данные
     * @protected
     */
    protected _serverRequestSaveNewItemOverride(changeItem: DataItemType, other?: any) {
        this._storeStandardFullScreenPopup.setLoading({
            componentProps:{
                loadingText: 'Создание элемента'
            },
            keyCurrentActivePage: this._pageKey
        });
    }

    /**
     * Запрос на сервер, на получение всех необходимых данных
     */
    public serverRequestGetAllStoreData() {
        this._storeStandardFullScreenPopup.setLoading({
           componentProps:{
               loadingText: 'Загрузка данных'
           },
           keyCurrentActivePage: this._pageKey
        });
    }

    /**
     * Применить все активные фильтры и сортировку
     * @param inputData
     * @protected
     */
    protected _applyAllFiltersAndSortingOverride(inputData: DataItemType[]): DataItemType[] {
        return inputData;
    }

    //endregion

    //region Прочее
    /**
     * Получить элемент по data атрибуту
     * @param element
     * @private
     */
    protected _getItemByDataAttribute(element: HTMLElement): DataItemType | undefined {
        const uuid: string | null = element.getAttribute('data-id');

        if (!uuid) {
            return undefined;
        }

        const targetItem = this._storeDataManager.getItemByUuid(uuid);

        if (!targetItem) {
            return undefined;
        }

        return Object.assign({}, targetItem);
    }

    protected _eventSaveEditableElement(inputData: AdminSaveEditableData<DataItemType>) {

        const {isNew, item, other} = inputData;

        // Скрываем окно
        this._setShowHideEditorDataStatus(true);

        // Определяем какой запрос вызвать
        if (isNew) {
            this._serverRequestSaveNewItemOverride(item, other);
        } else {
            this._serverRequestSaveChangeItemOverride(item, other);
        }
    }

    /**
     * Показать popup с ошибкой, не удалось создать новый элемент
     * @param errorText
     * @protected
     */
    protected _showErrorPopupCreateNewItem(errorText?: string) {
        // Сразу уничтожаем окно редактирования, случилось что то очень плохое если показано это окно =)
        this._destroyStoreEditor();

        // Показываем окно с ошибкой
        this._storeStandardFullScreenPopup.setErrorText({
            errorText: errorText ?? 'Получены некорректные данные',
            keyCurrentActivePage: this._pageKey
        });
    }

    //endregion

    get storeRouter() {
        return this._storeRouter;
    }


    _constructor(initData: InitDataBaseStorePageAdminContent<DataItemType, StoreApi, RouterPagesKeys>) {
        this.eventStartChangeItem = this.eventStartChangeItem.bind(this);
        this.eventStartAddNewItem = this.eventStartAddNewItem.bind(this);
        this.eventStartDeleteItem = this.eventStartDeleteItem.bind(this);
        this._eventCloseEditor = this._eventCloseEditor.bind(this);
        this._eventStartEditItemOverride = this._eventStartEditItemOverride.bind(this);
        this._eventSaveEditableElement = this._eventSaveEditableElement.bind(this);
        this._eventUpdateDisplayedData = this._eventUpdateDisplayedData.bind(this);
        this._eventApplyAllFiltersAndSorting = this._eventApplyAllFiltersAndSorting.bind(this);

        this._storeEditData_observable = undefined;
        this._errorWhileGettingData_observable = undefined;
        this._isHideEditorData_observable = false;

        this._pageKey = initData.pageKey;
        this._storeApi = initData.storeApi;
        this._storeStandardFullScreenPopup = initData.storeStandardFullScreenPopup;
        this._storeRouter = initData.storeRouter;
        this._storeSitePageTitle = initData.storeSitePageTitle;
        this._newEmptyItem = Object.assign({}, initData.newEmptyItem);
        this._storeDataManager = new StoreDataManager({
            callbackApplyFilters: this._eventApplyAllFiltersAndSorting
        });
        this.storeDataPagination = new StoreDataPagination<DataItemType>();
        this.storeSelectViewCatalog = new StoreComponentSelectViewFormatItems();
        this._referenceDataReceived = false;

        makeObservable<this,
            // Ошибка при получении данных
            '_errorWhileGettingData_observable'
            | '_setErrorWhileGettingData'
            // Редактирование данных
            | '_storeEditData_observable'
            | '_setStoreEditData'
            | '_destroyStoreEditor'
            // Скрыть редактор
            | '_isHideEditorData_observable'
            | '_setShowHideEditorDataStatus'>(this, {
            // Ошибка при получении данных
            _errorWhileGettingData_observable: observable.ref,
            _setErrorWhileGettingData: action,
            errorWhileGettingData: computed,
            // Редактирование данных
            _storeEditData_observable: observable.ref,
            _setStoreEditData: action,
            _destroyStoreEditor: action,
            storeEditData: computed,
            // Скрыть редактор
            _isHideEditorData_observable: observable.ref,
            _setShowHideEditorDataStatus: action
        });
    }
}

