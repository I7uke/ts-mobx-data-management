export interface DataSourceItem {
    readonly uuid: string;
}
export type DataSourceItemChangeType = 'addNewItem' | 'editItem' | 'deleteItem' | 'clear' | 'destroy' | 'newDataSource';
export type ListenerChangeDataSource<TItem extends DataSourceItem> = {
    readonly changeType: DataSourceItemChangeType;
    readonly itemsList: TItem[];
};
type CallbackApplyFilters<TItem extends DataSourceItem> = (dataList: TItem[]) => TItem[];
type CallbackChangeDataSource<TItem extends DataSourceItem> = (param: ListenerChangeDataSource<TItem>) => void;
/**
 * Хранилище для управления данными
 */
export default class StoreDataSource<TItem extends DataSourceItem> {
    private _uniqueUuid;
    /**
     * Элементы для внутреннего хранения в формат Hash Tables
     * @private
     */
    private _internalItems;
    /**
     * Слушатели изменений элементов
     * @private
     */
    private _callbacksListenersChangeDataSource;
    /**
     * Функция для фильтрации элементов
     * @private
     */
    private _callbackApplyFilters?;
    /**
     * Проверяет наличие uuid у элемента и возвращает корректный элемент
     * Если uuid не строка или пустая строка будет присвоен новый uuid
     * Если uuid строка и такого uuid нет не у одного элемента будет оставлен переданный uuid, в противном случае присвоен новый uuid
     * @param item
     * @private
     */
    private _validNewItem;
    /**
     * Проверить существующий элемент
     * Если uuid не строка или пустая строка вернет undefined
     * Если элемента нет в списке элементов вернет undefined
     * @param item
     * @private
     */
    private _validExistingItem;
    /**
     * Добавляет новый элемент к общему списку
     * @param newItem
     * @private
     */
    private _addNewItem;
    /**
     * Редактировать существующий элемент
     * @param existingItem
     * @private
     */
    private _ediItem;
    /**
     * Удалить существующий элемент по uuid
     * @param uuid
     * @private
     */
    private _deleteItemByUuid;
    /**
     * Получить элемент по uuid
     * @param uuid
     * @private
     */
    private _getItemByUuid;
    /**
     * Преобразовать элементы в массив и получить их
     * @private
     */
    private _getItemsArray;
    /**
     * Применить слушатели изменения данных
     * @param param
     * @private
     */
    private _applyCallbacksListenersChangeDataSource;
    /**
     * Применить функцию фильтрации если есть
     * @private
     */
    private _applyCallbackFilter;
    constructor();
    /**
     * Получить список элементов
     * Если есть функция фильтрации будет применен фильтр
     */
    get itemsList(): TItem[];
    /**
     * Количество элементов
     */
    get itemsCount(): number;
    /**
     * Добавить слушатель изменения данных
     * @param listener
     */
    addListenerChangeDataSource(listener: CallbackChangeDataSource<TItem>): void;
    /**
     * Удалить слушатель изменения данных
     * @param listener
     */
    removeListenerChangeDataSource(listener: CallbackChangeDataSource<TItem>): boolean;
    /**
     * Добавить функцию фильтрации
     * @param callback - функция фильтрации
     */
    setFilter(callback: CallbackApplyFilters<TItem>): void;
    /**
     * Удалить функцию фильтрации
     */
    removeFilter(): boolean;
    /**
     * Получить элемент по его uuid
     * Если не удалось найти элемент по uuid вернет undefined
     * @param uuid
     */
    getItemByUuid(uuid: string): undefined | TItem;
    /**
     * Получить список элементов по их uuid
     * @param uuidList
     */
    getItemsListByUuid(uuidList: string[]): TItem[];
    /**
     * Установить новый источник данных
     * При установке очистит старый набор данных
     * @param itemsList - Список элементов
     * @param isWithoutTrigger - триггеры слушателей не сработают если флаг будет установлен в true
     */
    setNewDataSource(itemsList: TItem[], isWithoutTrigger?: boolean): void;
    /**
     * Очищает текущий набор данных
     * @param isWithoutTrigger - триггеры слушателей не сработают если флаг будет установлен в true
     */
    clearDataSource(isWithoutTrigger?: boolean): void;
    /**
     * Очищает все переданные данные
     * Будет очищен набор хранимых элементов, все слушатели, функция фильтрации
     * @param isWithoutTrigger
     */
    destroy(isWithoutTrigger?: boolean): void;
    /**
     * Удалить существующий элемент по uuid
     * В случае успешного удаления вернет true
     * Если не удалось удалить элемент вернет false
     * @param uuid - uuid элемента который нужно удалить
     * @param isWithoutTrigger - триггеры слушателей не сработают если флаг будет установлен в true
     */
    deleteItemByUuid(uuid: string, isWithoutTrigger?: boolean): boolean;
    /**
     * Удалить список элементов по их uuid
     * Вернет true если удалось удалить все переданные элементы
     * Если хотя бы один элемент не удалось удалить вернет false
     * @param uuidList - список uuid элементов которые нужно удалить
     * @param isWithoutTrigger - триггеры слушателей не сработают если флаг будет установлен в true
     */
    deleteItemsListByUuid(uuidList: string[], isWithoutTrigger?: boolean): boolean;
    /**
     * Добавить новый элемент
     * @param item - новый элемент который нужно добавить
     * @param isWithoutTrigger - триггеры слушателей не сработают если флаг будет установлен в true
     */
    addNewItem(item: TItem, isWithoutTrigger?: boolean): TItem | undefined;
    /**
     * Добавить список новых элементов
     * @param itemsList - список новых элементов которые необходимо добавить
     * @param isWithoutTrigger - триггеры слушателей не сработают если флаг будет установлен в true
     */
    addNewItemsList(itemsList: TItem[], isWithoutTrigger?: boolean): TItem[];
    /**
     * Редактировать существующий элемент
     * Вернет элемент если его удалось найти в общем списке
     * Если элемент не удалось найти вернет undefined
     * @param item - Элемент который нужно отредактировать
     * @param isWithoutTrigger - триггеры слушателей не сработают если флаг будет установлен в true
     */
    editItem(item: TItem, isWithoutTrigger?: boolean): TItem | undefined;
    /**
     * Редактировать список существующих элементов
     * Вернет массив измененных элементов
     * Если не удалось изменить не один элемент вернет пустой массив
     * @param itemsList - список элементов которые нужно изменить
     * @param isWithoutTrigger - триггеры слушателей не сработают если флаг будет установлен в true
     */
    editItemsList(itemsList: TItem[], isWithoutTrigger?: boolean): TItem[];
}
export {};
