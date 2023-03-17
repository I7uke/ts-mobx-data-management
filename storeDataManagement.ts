import cloneDeep from "lodash.clonedeep";
import {DataWithUuid} from "./type/dataWithUuid";
import { v4 as uuidv4 } from 'uuid';

type ChangeDataSource<TItem extends DataWithUuid> = {
    readonly changeType: 'addNewItem' | 'editItem' | 'deleteItem';
    readonly itemsList: TItem[];
}

type CallbackApplyFilters<TItem extends DataWithUuid> = (dataList: TItem[]) => TItem[];
type CallbackChangeDataSource<TItem extends DataWithUuid> = (param: ChangeDataSource<TItem>) => void;

type InitData<TItem extends DataWithUuid> = {
    readonly filters?: CallbackApplyFilters<TItem>;
}

/**
 * Хранилище для управления данными
 */
export class StoreDataSource<TItem extends DataWithUuid> {
    /**
     * Элементы для внутреннего хранения в формат Hash Tables
     * @private
     */
    private _internalItems: Map<string, TItem>;

    /**
     * Слушатели изменений элементов
     * @private
     */
    private _callbacksListenersChangeDataSource: Record<string, CallbackChangeDataSource<TItem>>;
    private _callbackApplyFilters?: CallbackApplyFilters<TItem>;

    /**
     * Проверяет наличие uuid у элемента и возвращает корректный элемент
     * Если uuid не строка или пустая строка будет присвоен новый uuid
     * Если uuid строка и такого uuid нет не у одного элемента будет оставлен переданный uuid, в противном случае присвоен новый uuid
     * @param item
     * @private
     */
    private _validItem(item: TItem): TItem {
        const copyItem:TItem = cloneDeep(item);

        if (typeof copyItem.uuid !== 'string') {
            return {
                ...copyItem,
                uuid: uuidv4()
            }
        }

        if (!copyItem.uuid) {
            return {
                ...copyItem,
                uuid: uuidv4()
            }
        }

        if (this._internalItems.has(copyItem.uuid)) {
            return {
                ...copyItem,
                uuid: uuidv4()
            }
        }

        return copyItem;
    }

    /**
     * Добавляет новый элемент к общему списку
     * @param newItem
     * @private
     */
    private _addNewItem(newItem: TItem):TItem {
        const validNewItem = this._validItem(newItem);
        this._internalItems.set(validNewItem.uuid, validNewItem);
        return validNewItem;
    }

    /**
     * Редактировать существующий элемент
     * @param existingItem
     * @private
     */
    private _ediItem(existingItem: TItem): TItem | undefined {
        const validExistingItem = this._validItem(existingItem);

        if(this._internalItems.has(validExistingItem.uuid)){
            this._internalItems.set(validExistingItem.uuid, validExistingItem);
            return validExistingItem;
        }

        return undefined;
    }

    /**
     * Удалить существующий элемент по uuid
     * @param uuid
     * @private
     */
    private _deleteItemByUuid(uuid: string): boolean {
        if (typeof uuid !== 'string') {
            return false;
        }

        if (!uuid) {
            return false;
        }

        return this._internalItems.delete(uuid);
    }

    /**
     * Получить элемент по uuid
     * @param uuid
     * @private
     */
    private _getItemByUuid(uuid: string): undefined | TItem {
        if(typeof uuid !== 'string'){
            return undefined;
        }

        if(!uuid){
            return undefined;
        }

        if(this._internalItems.has(uuid)) {
            return cloneDeep(this._internalItems.get(uuid));
        }

        return undefined;
    }

    /**
     * Преобразовать элементы в массив и получить их
     * @private
     */
    private _getItemsArray(): TItem[] {
        const arr: TItem[] = Array.from(this._internalItems.values());
        return cloneDeep(arr);
    }

    /**
     * Применить слушатели изменения данных
     * @param param
     * @private
     */
    private _applyCallbacksListenersChangeDataSource(param: ChangeDataSource<TItem>) {
        for (const keyListener in this._callbacksListenersChangeDataSource) {
            if (this._callbacksListenersChangeDataSource.hasOwnProperty(keyListener)) {
                if (typeof this._callbacksListenersChangeDataSource[keyListener] === 'function') {
                    this._callbacksListenersChangeDataSource[keyListener](param);
                }
            }
        }
    }

    private _applyCallbackFilter(): TItem[] {
        const itemsArray: TItem[] = this._getItemsArray();

        if (typeof this._callbackApplyFilters === 'function') {
            return this._callbackApplyFilters(itemsArray);
        }

        return itemsArray;
    }


    constructor(initData?: InitData<TItem>) {
        this._internalItems = new Map<string, TItem>();
        this._callbacksListenersChangeDataSource = {};
        this._callbackApplyFilters = initData?.filters;
    }

    /**
     * Получить список элементов
     */
    get itemsList(): TItem[] {
        const arr: TItem[] = Array.from(this._internalItems.values());
        return cloneDeep(arr);
    }

    //region Добавить/удалить слушатель изменения данных
    /**
     * Добавить слушатель изменения данных
     * @param listener
     */
    public addChangeDataSourceListener(listener: CallbackChangeDataSource<TItem>){
        const listenerId: string = uuidv4();
        this._callbacksListenersChangeDataSource[listenerId] = listener;
    }

    /**
     * Удалить слушатель изменения данных
     * @param listener
     */
    public removeChangeDataSourceListener(listener: CallbackChangeDataSource<TItem>) {
        for (const listenerId in this._callbacksListenersChangeDataSource) {
            if (listener === this._callbacksListenersChangeDataSource[listenerId]) {
                delete this._callbacksListenersChangeDataSource[listenerId];
                return;
            }
        }
    }
    //endregion


    /**
     * Получить элемент по его uuid
     * Если не удалось найти элемент по uuid вернет undefined
     * @param uuid
     */
    public getItemByUuid(uuid: string): undefined | TItem {
        return this._getItemByUuid(uuid);
    }

    /**
     * Получить список элементов по их uuid
     * @param uuidList
     */
    public getItemsListByUuid(uuidList: string[]): TItem[] {
        const result: TItem[] = [];

        if(!Array.isArray(uuidList)){
            return result;
        }

        for(const uuid of uuidList){
            const item = this._getItemByUuid(uuid);
            if(item){
                result.push(item);
            }
        }

        return result;
    }


    /**
     * Удалить существующий элемент по uuid
     * В случае успешного удаления вернет true
     * Если не удалось удалить элемент вернет false
     * @param uuid - uuid элемента который нужно удалить
     * @param isWithoutTrigger - триггеры слушателей не сработают если флаг будет установлен в true
     */
    public deleteItemByUuid(uuid: string, isWithoutTrigger?: boolean ): boolean {
        const isDeleteItem: boolean = this._deleteItemByUuid(uuid);

        if(!isWithoutTrigger) {
            this._applyCallbacksListenersChangeDataSource({
                changeType: 'deleteItem',
                itemsList: this._applyCallbackFilter()
            });
        }

        return isDeleteItem
    }

    /**
     * Удалить список элементов по их uuid
     * Вернет true если удалось удалить все переданные элементы
     * Если хотя бы один элемент не удалось удалить вернет false
     * @param uuidList - список uuid элементов которые нужно удалить
     * @param isWithoutTrigger - триггеры слушателей не сработают если флаг будет установлен в true
     */
    public deleteItemsListByUuid(uuidList: string[], isWithoutTrigger?: boolean): boolean {
        if (!Array.isArray(uuidList)) {
            return false;
        }

        let isDeleteAllSuccess: boolean = true;

        for (const uuid of uuidList) {
            const isDeleteItemSuccess: boolean = this._deleteItemByUuid(uuid);

            if (!isDeleteItemSuccess) {
                isDeleteAllSuccess = false;
            }
        }

        if (!isWithoutTrigger) {
            if (isDeleteAllSuccess) {
                this._applyCallbacksListenersChangeDataSource({
                    changeType: 'deleteItem',
                    itemsList: this._applyCallbackFilter()
                });
            }
        }

        return isDeleteAllSuccess;
    }

    /**
     * Добавить новый элемент
     * @param item - новый элемент который нужно добавить
     * @param isWithoutTrigger - триггеры слушателей не сработают если флаг будет установлен в true
     */
    public addNewItem(item: TItem, isWithoutTrigger?: boolean ): TItem {
       const newItem = this._addNewItem(item);

        if(!isWithoutTrigger) {
            this._applyCallbacksListenersChangeDataSource({
                changeType: 'addNewItem',
                itemsList: this._applyCallbackFilter()
            });
        }

        return newItem;
    }

    /**
     * Добавить список новых элементов
     * @param itemsList - список новых элементов которые необходимо добавить
     * @param isWithoutTrigger
     */
    public addNewItemsList(itemsList: TItem[], isWithoutTrigger?: boolean ): TItem[] {
        const addedItemsList: TItem[] = [];

        if(!Array.isArray(itemsList)) {
            return addedItemsList;
        }

        for(const item of itemsList){
            const addedItem = this._addNewItem(item);
            addedItemsList.push(addedItem);
        }

        if(!isWithoutTrigger) {
            this._applyCallbacksListenersChangeDataSource({
                changeType: 'addNewItem',
                itemsList: this._applyCallbackFilter()
            });
        }

        return addedItemsList;
    }


    /**
     * Редактировать существующий элемент
     * Вернет элемент если его удалось найти в общем списке
     * Если элемент не удалось найти вернет undefined
     * @param item
     * @param isWithoutTrigger
     */
    public editItem(item: TItem, isWithoutTrigger?: boolean ): TItem | undefined {
        const editItem: TItem | undefined = this._ediItem(item);

        if(!isWithoutTrigger) {
            if (editItem){
                this._applyCallbacksListenersChangeDataSource({
                    changeType: 'editItem',
                    itemsList: this._applyCallbackFilter()
                });
            }
        }

        return editItem;
    }




    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    // /**
    //  * Сбросить все данные хранилища
    //  */
    // public resetStoreData() {
    //     this._dataForManage = [];
    // }
    //
    //
    //
    //
    // //region Данные для управления
    //
    // /**
    //  * Получить все текущие управляемые данные
    //  */
    // get allDataForManage() {
    //     return this._dataForManage.slice();
    // }
    //
    // /**
    //  * Получить текущие управляемые данные
    //  */
    // get dataForManage() {
    //     const copyData = this._dataForManage.slice();
    //
    //     if (typeof this._applyFilters === 'function') {
    //         // Если есть функция фильтрации, фильтруем данные и отдаем их
    //         return this._applyFilters(copyData);
    //     }
    //
    //     // Если функции фильтрации нет, просто отдаем данные
    //     return copyData;
    // }
    //
    // /**
    //  * Установлены данные или нет
    //  */
    // get isDataSet(): boolean {
    //     return !!this._dataForManage.length;
    // }
    //
    // /**
    //  * Установить данные для управления
    //  * @param dataList
    //  */
    // set dataForManage(dataList: DataItem[]) {
    //     this._dataForManage = dataList.slice();
    // }
    //
    // //endregion
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    // //region Функция фильтрации данных
    // private _applyFilters?: CallbackApplyFilters<DataItem>;
    //
    // /**
    //  * Установить функцию фильтрации
    //  * @param callbackApplyFilters
    //  */
    // public setDataFilters(callbackApplyFilters: CallbackApplyFilters<DataItem>) {
    //     this._applyFilters = callbackApplyFilters
    // }
    //
    // //endregion
    //
    //
    //
    //
    //
    //
    //
    // /**
    //  * Получить uuid элемента по атрибуту data-uuid HTML элемента
    //  * @param element
    //  */
    // public getUuidByDataAttributeHTMLElement(element: HTMLElement): string | null {
    //     return element.getAttribute('data-id');
    // }
    //
    // /**
    //  * Найти элемент по атрибуту data-uuid
    //  * @param element
    //  */
    // public getItemByDataAttributeUuid(element: HTMLElement): DataItem | undefined {
    //     const uuid: string | null = this.getUuidByDataAttributeHTMLElement(element);
    //
    //     if (!uuid) {
    //         return undefined;
    //     }
    //
    //     const foundElement = this.getItemByUuid(uuid);
    //
    //     if (!foundElement) {
    //         return undefined;
    //     }
    //
    //     return foundElement;
    // }


}
