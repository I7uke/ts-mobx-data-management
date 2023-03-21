import cloneDeep from "lodash.clonedeep";
import {v4 as uuidv4} from 'uuid';

export interface DataSourceItem {
    readonly uuid: string;
}

export type DataSourceItemChangeType = 'addNewItem' | 'editItem' | 'deleteItem' | 'clear' | 'destroy' | 'newDataSource';

export type ListenerChangeDataSource<TItem extends DataSourceItem> = {
    readonly changeType: DataSourceItemChangeType;
    readonly itemsList: TItem[];
}

type CallbackApplyFilters<TItem extends DataSourceItem> = (dataList: TItem[]) => TItem[];
type CallbackChangeDataSource<TItem extends DataSourceItem> = (param: ListenerChangeDataSource<TItem>) => void;

/**
 * Хранилище для управления данными
 */
export default class StoreDataSource<TItem extends DataSourceItem> {
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

    /**
     * Функция для фильтрации элементов
     * @private
     */
    private _callbackApplyFilters?: CallbackApplyFilters<TItem>;

    /**
     * Проверяет наличие uuid у элемента и возвращает корректный элемент
     * Если uuid не строка или пустая строка будет присвоен новый uuid
     * Если uuid строка и такого uuid нет не у одного элемента будет оставлен переданный uuid, в противном случае присвоен новый uuid
     * @param item
     * @private
     */
    private _validNewItem(item: TItem): TItem | undefined {
        if (!item) {
            return undefined;
        }

        if (Array.isArray(item)) {
            return undefined;
        }

        if (typeof item !== 'object') {
            return undefined;
        }

        const copyItem: TItem = cloneDeep(item);

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
     * Проверить существующий элемент
     * Если uuid не строка или пустая строка вернет undefined
     * Если элемента нет в списке элементов вернет undefined
     * @param item
     * @private
     */
    private _validExistingItem(item: TItem): TItem | undefined {
        if (!item) {
            return undefined;
        }

        if (Array.isArray(item)) {
            return undefined;
        }

        if (typeof item !== 'object') {
            return undefined;
        }

        if (typeof item.uuid !== 'string') {
            return undefined;
        }

        if (!item.uuid) {
            return undefined;
        }

        if (!this._internalItems.has(item.uuid)) {
            return undefined;
        }

        return cloneDeep(item);
    }

    /**
     * Добавляет новый элемент к общему списку
     * @param newItem
     * @private
     */
    private _addNewItem(newItem: TItem): TItem | undefined {
        const validNewItem = this._validNewItem(newItem);

        if (!validNewItem) {
            return undefined;
        }

        this._internalItems.set(validNewItem.uuid, validNewItem);
        return cloneDeep(validNewItem);
    }

    /**
     * Редактировать существующий элемент
     * @param existingItem
     * @private
     */
    private _ediItem(existingItem: TItem): TItem | undefined {
        const validExistingItem = this._validExistingItem(existingItem);

        if (validExistingItem) {
            this._internalItems.set(validExistingItem.uuid, validExistingItem);
            return cloneDeep(validExistingItem);
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
        if (typeof uuid !== 'string') {
            return undefined;
        }

        if (!uuid) {
            return undefined;
        }

        if (this._internalItems.has(uuid)) {
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
    private _applyCallbacksListenersChangeDataSource(param: ListenerChangeDataSource<TItem>) {
        for (const keyListener in this._callbacksListenersChangeDataSource) {
            if (this._callbacksListenersChangeDataSource.hasOwnProperty(keyListener)) {
                if (typeof this._callbacksListenersChangeDataSource[keyListener] === 'function') {
                    this._callbacksListenersChangeDataSource[keyListener](param);
                }
            }
        }
    }

    /**
     * Применить функцию фильтрации если есть
     * @private
     */
    private _applyCallbackFilter(): TItem[] {
        const itemsArray: TItem[] = this._getItemsArray();

        if (typeof this._callbackApplyFilters === 'function') {
            return this._callbackApplyFilters(itemsArray);
        }

        return itemsArray;
    }

    constructor() {
        this._internalItems = new Map<string, TItem>();
        this._callbacksListenersChangeDataSource = {};
        this._callbackApplyFilters = undefined;
    }

    /**
     * Получить список элементов
     * Если есть функция фильтрации будет применен фильтр
     */
    get itemsList(): TItem[] {
        return this._applyCallbackFilter();
    }

    /**
     * Количество элементов
     */
    get itemsCount(): number {
        return this._internalItems.size;
    }

    /**
     * Добавить слушатель изменения данных
     * @param listener
     */
    public addListenerChangeDataSource(listener: CallbackChangeDataSource<TItem>) {
        const listenerId: string = uuidv4();
        this._callbacksListenersChangeDataSource[listenerId] = listener;
    }

    /**
     * Удалить слушатель изменения данных
     * @param listener
     */
    public removeListenerChangeDataSource(listener: CallbackChangeDataSource<TItem>): boolean {
        for (const listenerId in this._callbacksListenersChangeDataSource) {
            if (listener === this._callbacksListenersChangeDataSource[listenerId]) {
                return delete this._callbacksListenersChangeDataSource[listenerId];
            }
        }
        return false;
    }

    /**
     * Добавить функцию фильтрации
     * @param callback - функция фильтрации
     */
    public addFilter(callback: CallbackApplyFilters<TItem>) {
        this._callbackApplyFilters = callback;
    }

    /**
     * Удалить функцию фильтрации
     */
    public removeFilter() {
        this._callbackApplyFilters = undefined;
    }

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
        if (!Array.isArray(uuidList)) {
            return [];
        }

        const result: TItem[] = [];
        for (const uuid of uuidList) {
            const item = this._getItemByUuid(uuid);
            if (item) {
                result.push(item);
            }
        }

        return cloneDeep(result);
    }

    /**
     * Установить новый источник данных
     * При установке очистит старый набор данных
     * @param itemsList - Список элементов
     * @param isWithoutTrigger - триггеры слушателей не сработают если флаг будет установлен в true
     */
    public setNewDataSource(itemsList: TItem[], isWithoutTrigger?: boolean) {
        // Очищаем текущий источник данных
        this._internalItems.clear();
        // Добавляем элементы
        for (const item of itemsList) {
            const validItem = this._validNewItem(item);

            if (validItem) {
                this._internalItems.set(validItem.uuid, validItem);
            }
        }

        if (!isWithoutTrigger) {
            this._applyCallbacksListenersChangeDataSource({
                changeType: 'newDataSource',
                itemsList: this._applyCallbackFilter()
            });
        }
    }

    /**
     * Очищает текущий набор данных
     * @param isWithoutTrigger - триггеры слушателей не сработают если флаг будет установлен в true
     */
    public clearDataSource(isWithoutTrigger?: boolean) {
        this._internalItems.clear();

        if (!isWithoutTrigger) {
            this._applyCallbacksListenersChangeDataSource({
                changeType: 'clear',
                itemsList: this._applyCallbackFilter()
            });
        }
    }

    /**
     * Очищает все переданные данные
     * Будет очищен набор хранимых элементов, все слушатели, функция фильтрации
     * @param isWithoutTrigger
     */
    public destroy(isWithoutTrigger?: boolean) {
        // Забываем все хранимые элементы
        this._internalItems.clear();
        // Очищаем всех слушателей
        this._callbacksListenersChangeDataSource = {};
        // Забываем функцию фильтрации
        this._callbackApplyFilters = undefined;

        if (!isWithoutTrigger) {
            this._applyCallbacksListenersChangeDataSource({
                changeType: 'destroy',
                itemsList: this._applyCallbackFilter()
            });
        }
    }

    /**
     * Удалить существующий элемент по uuid
     * В случае успешного удаления вернет true
     * Если не удалось удалить элемент вернет false
     * @param uuid - uuid элемента который нужно удалить
     * @param isWithoutTrigger - триггеры слушателей не сработают если флаг будет установлен в true
     */
    public deleteItemByUuid(uuid: string, isWithoutTrigger?: boolean): boolean {
        const isDeleteItem: boolean = this._deleteItemByUuid(uuid);

        if (!isWithoutTrigger) {
            if (isDeleteItem) {
                this._applyCallbacksListenersChangeDataSource({
                    changeType: 'deleteItem',
                    itemsList: this._applyCallbackFilter()
                });
            }
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

        const needDeleteItemsCount: number = uuidList.length;
        let successDeleteItemsCount: number = 0;

        for (const uuid of uuidList) {
            const isDeleteItemSuccess: boolean = this._deleteItemByUuid(uuid);

            if (isDeleteItemSuccess) {
                successDeleteItemsCount++;
            }
        }

        if (!isWithoutTrigger) {
            if (successDeleteItemsCount > 0) {
                this._applyCallbacksListenersChangeDataSource({
                    changeType: 'deleteItem',
                    itemsList: this._applyCallbackFilter()
                });
            }
        }

        return needDeleteItemsCount === successDeleteItemsCount;
    }

    /**
     * Добавить новый элемент
     * @param item - новый элемент который нужно добавить
     * @param isWithoutTrigger - триггеры слушателей не сработают если флаг будет установлен в true
     */
    public addNewItem(item: TItem, isWithoutTrigger?: boolean): TItem | undefined {

        const newItem = this._addNewItem(item);

        if (!newItem) {
            return undefined;
        }

        if (!isWithoutTrigger) {
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
     * @param isWithoutTrigger - триггеры слушателей не сработают если флаг будет установлен в true
     */
    public addNewItemsList(itemsList: TItem[], isWithoutTrigger?: boolean): TItem[] {
        if (!Array.isArray(itemsList)) {
            return [];
        }

        const addedItemsList: TItem[] = [];

        for (const item of itemsList) {
            const addedItem = this._addNewItem(item);

            if (addedItem) {
                addedItemsList.push(addedItem);
            }
        }

        if (!isWithoutTrigger) {
            if (addedItemsList.length) {
                this._applyCallbacksListenersChangeDataSource({
                    changeType: 'addNewItem',
                    itemsList: this._applyCallbackFilter()
                });
            }
        }

        return addedItemsList;
    }

    /**
     * Редактировать существующий элемент
     * Вернет элемент если его удалось найти в общем списке
     * Если элемент не удалось найти вернет undefined
     * @param item - Элемент который нужно отредактировать
     * @param isWithoutTrigger - триггеры слушателей не сработают если флаг будет установлен в true
     */
    public editItem(item: TItem, isWithoutTrigger?: boolean): TItem | undefined {
        const editItem: TItem | undefined = this._ediItem(item);

        if (!isWithoutTrigger) {
            if (editItem) {
                this._applyCallbacksListenersChangeDataSource({
                    changeType: 'editItem',
                    itemsList: this._applyCallbackFilter()
                });
            }
        }

        return editItem;
    }

    /**
     * Редактировать список существующих элементов
     * Вернет массив измененных элементов
     * Если не удалось изменить не один элемент вернет пустой массив
     * @param itemsList - список элементов которые нужно изменить
     * @param isWithoutTrigger - триггеры слушателей не сработают если флаг будет установлен в true
     */
    public editItemsList(itemsList: TItem[], isWithoutTrigger?: boolean): TItem[] {

        if (!Array.isArray(itemsList)) {
            return [];
        }

        const changedItemsList: TItem[] = [];

        for (const item of itemsList) {
            const changedItem = this._ediItem(item);

            if (changedItem) {
                changedItemsList.push(changedItem);
            }
        }

        if (!isWithoutTrigger) {
            if (changedItemsList.length) {
                this._applyCallbacksListenersChangeDataSource({
                    changeType: 'editItem',
                    itemsList: this._applyCallbackFilter()
                });
            }
        }

        return changedItemsList;
    }
}