import cloneDeep from "lodash.clonedeep";
import {DataWithUuid} from "./type/dataWithUuid";

type CallbackApplyFilters<TItem extends DataWithUuid> = (dataList: TItem[]) => TItem[];

type InitData<TItem extends DataWithUuid> = {
    readonly dataList?:TItem[];
    readonly filters?: CallbackApplyFilters<TItem>;
}

/**
 * Хранилище для управления данными
 */
export class StoreDataManager<TItem extends DataWithUuid> {

    private _dataList: TItem[];

    get dataList(): TItem[] {
        return cloneDeep(this._dataList);
    }


    //region Данные для управления

    /**
     * Получить все текущие управляемые данные
     */
    get allDataForManage() {
        return this._dataForManage.slice();
    }

    /**
     * Получить текущие управляемые данные
     */
    get dataForManage() {
        const copyData = this._dataForManage.slice();

        if (typeof this._applyFilters === 'function') {
            // Если есть функция фильтрации, фильтруем данные и отдаем их
            return this._applyFilters(copyData);
        }

        // Если функции фильтрации нет, просто отдаем данные
        return copyData;
    }

    /**
     * Установлены данные или нет
     */
    get isDataSet(): boolean {
        return !!this._dataForManage.length;
    }

    /**
     * Установить данные для управления
     * @param dataList
     */
    set dataForManage(dataList: DataItem[]) {
        this._dataForManage = dataList.slice();
    }

    //endregion

    //region Функция фильтрации данных
    private _applyFilters?: CallbackApplyFilters<DataItem>;

    /**
     * Установить функцию фильтрации
     * @param callbackApplyFilters
     */
    public setDataFilters(callbackApplyFilters: CallbackApplyFilters<DataItem>) {
        this._applyFilters = callbackApplyFilters
    }

    //endregion

    constructor(initData?: InitDataStoreDataManager<DataItem>) {
        const initDataForManage: DataItem[] | undefined = initData?.dataForManage;

        this._dataForManage = (Array.isArray(initDataForManage)) ? initDataForManage.slice() : [];
        this._applyFilters = (typeof initData?.callbackApplyFilters === 'function') ? initData.callbackApplyFilters : undefined;
    }

    /**
     * Получить uuid элемента по атрибуту data-uuid HTML элемента
     * @param element
     */
    public getUuidByDataAttributeHTMLElement(element: HTMLElement): string | null {
        return element.getAttribute('data-id');
    }

    /**
     * Найти элемент по атрибуту data-uuid
     * @param element
     */
    public getItemByDataAttributeUuid(element: HTMLElement): DataItem | undefined {
        const uuid: string | null = this.getUuidByDataAttributeHTMLElement(element);

        if (!uuid) {
            return undefined;
        }

        const foundElement = this.getItemByUuid(uuid);

        if (!foundElement) {
            return undefined;
        }

        return foundElement;
    }

    /**
     * Найти элемент по uuid, отдает КОПИЮ
     * @param uuid
     */
    public getItemByUuid(uuid: string): undefined | DataItem {
        for (let i = 0; i < this._dataForManage.length; ++i) {
            if (this._dataForManage[i].uuid === uuid) {
                return Object.assign({}, this._dataForManage[i]);
            }
        }
        return undefined;
    }

    /**
     * Удалить элемент по uuid
     * Вернет true если удалось удалить
     * @param uuid
     */
    public deleteItemByUuid(uuid: string): boolean {
        let deleteItemIndex: number = -1;
        for (let i = 0; i < this._dataForManage.length; ++i) {
            if (this._dataForManage[i].uuid === uuid) {
                deleteItemIndex = i;
            }
        }

        if (deleteItemIndex === -1) {
            return false;
        }

        this._dataForManage.splice(deleteItemIndex, 1);
        return true;
    }

    /**
     * Добавить новый элемент
     * @param item
     */
    public addNewItem(item: DataItem): DataItem {
        const newItemCopy: DataItem = {
            ...item,
            uuid: uuidv4()
        };
        // Добавляем в начало
        this._dataForManage.unshift(newItemCopy);
        return newItemCopy;
    }

    /**
     * Редактировать существующий элемент, создает КОПИЮ и редактирует ее
     * Вернет true если элемент удалось изменить
     * @param item
     */
    public editExistingItem(item: DataItem): DataItem | undefined {
        const copyEditItem: DataItem = Object.assign({}, item);

        for (let i = 0; i < this._dataForManage.length; ++i) {
            if (this._dataForManage[i].uuid === copyEditItem.uuid) {
                this._dataForManage[i] = copyEditItem;
                return copyEditItem;
            }
        }
        return undefined;
    }

    /**
     * Сбросить все данные хранилища
     */
    public resetStoreData() {
        this._dataForManage = [];
    }
}
