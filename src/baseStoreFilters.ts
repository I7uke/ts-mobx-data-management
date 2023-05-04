type SearchStringParams<TItem extends Object> = {
    /**
     * Список элементов для поиска
     */
    readonly itemsList: TItem[];
    /**
     * Название полей по которым будет происходить поиск
     */
    readonly fieldsNames: (keyof TItem)[];
    /**
     * Поисковый запрос
     */
    readonly searchQuery: string;
}

type PrimitiveTypes = null | undefined | number | string | boolean;

type FilterArrayFieldByArrayValuesParams<TItem extends Object> = {
    /**
     * Список элементов для поиска
     */
    readonly itemsList: TItem[];
    /**
     * Список искомых значений
     */
    readonly searchValuesList: PrimitiveTypes[];
    /**
     * Название полей по которым будет происходить поиск
     */
    readonly fieldsNames: (keyof TItem)[];
}

type FilterByValuesListParams<TItem extends Object> = {
    /**
     * Список элементов для поиска
     */
    readonly itemsList: TItem[];
    /**
     * Список искомых значений
     */
    readonly searchValuesList: PrimitiveTypes[];
    /**
     * Название полей по которым будет происходить поиск
     */
    readonly fieldsNames: (keyof TItem)[];
}

type FilterByValueParams<TItem extends Object> = {
    /**
     * Список элементов для поиска
     */
    readonly itemsList: TItem[];
    /**
     * Искомое значение
     */
    readonly searchValue: PrimitiveTypes;
    /**
     * Название полей по которым будет происходить поиск
     */
    readonly fieldsNames: (keyof TItem)[];
}

export default class BaseStoreFilters<TItem extends Object> {
    private _callbackUpdateViewData?: () => void;

    /**
     * Событие обновить отображаемые данные
     */
    public eventUpdateViewData() {
        if (typeof this._callbackUpdateViewData === 'function') {
            this._callbackUpdateViewData();
        }
    }

    constructor() {
        this.applyFilters = this.applyFilters.bind(this);
        this.eventUpdateViewData = this.eventUpdateViewData.bind(this);
        this._callbackUpdateViewData = undefined;
    }

    /**
     * Установить callback обновления данных
     * @param callback
     */
    public setCallbackUpdateViewData(callback: () => void) {
        this._callbackUpdateViewData = callback;
    }

    /**
     * Удалить callback обновления данных
     */
    public removeCallbackUpdateViewData() {
        this._callbackUpdateViewData = undefined;
    }

    /**
     * Применить фильтры по порядку
     * @param inputData
     * @param filtersList
     * @protected
     */
    protected _applyFiltersInOrder(inputData: TItem[], filtersList: ((itemsList: TItem[]) => TItem[])[]): TItem[] {
        let result: TItem[] = inputData;

        for (const filter of filtersList) {
            result = filter(result);
        }

        return result;
    }

    /**
     * Применить фильтры
     * @param inputItems
     * @protected
     */
    protected _applyFiltersOverride(inputItems: TItem[]): TItem[] {
        throw new Error('method _applyFiltersOverride must be override');
    }

    public applyFilters(inputItems: TItem[]): TItem[] {
        return this._applyFiltersOverride(inputItems);
    }

    //region Сортировки
    /**
     * Сортировать по строковому полю от A до Z
     * @param inputData
     * @param fieldNameStrType
     * @protected
     */
    protected _sortString_AZ(inputData: TItem[], fieldNameStrType: keyof TItem): TItem[] {
        inputData.sort((a: TItem, b: TItem) => {
            const itemTmpA = a[fieldNameStrType];
            const itemTmpB = b[fieldNameStrType];

            const itemA: string = (typeof itemTmpA === 'string') ? itemTmpA : String(itemTmpA);
            const itemB: string = (typeof itemTmpB === 'string') ? itemTmpB : String(itemTmpB);

            if (itemA > itemB) {
                return 1;
            }

            if (itemA < itemB) {
                return -1;
            }

            return 0;
        });

        return inputData;
    }

    /**
     * Сортировать по строковому полю от Z до А
     * @param inputData
     * @param fieldNameStrType
     * @protected
     */
    protected _sortString_ZA(inputData: TItem[], fieldNameStrType: keyof TItem): TItem[] {
        inputData.sort((a: TItem, b: TItem) => {
            const itemTmpA = a[fieldNameStrType];
            const itemTmpB = b[fieldNameStrType];

            const itemA: string = (typeof itemTmpA === 'string') ? itemTmpA : String(itemTmpA);
            const itemB: string = (typeof itemTmpB === 'string') ? itemTmpB : String(itemTmpB);

            if (itemA > itemB) {
                return -1;
            }

            if (itemA < itemB) {
                return 1;
            }

            return 0;
        });

        return inputData;
    }

    /**
     * Сортировать по логическому полю от true до false
     * @param inputData
     * @param fieldNameStrType
     * @protected
     */
    protected _sortBoolean_TrueFalse(inputData: TItem[], fieldNameStrType: keyof TItem): TItem[] {
        inputData.sort((a: TItem, b: TItem) => {
            const itemTmpA = a[fieldNameStrType];
            const itemTmpB = b[fieldNameStrType];

            const itemA: boolean = (typeof itemTmpA === 'boolean') ? itemTmpA : !!itemTmpA;
            const itemB: boolean = (typeof itemTmpB === 'boolean') ? itemTmpB : !!itemTmpB;

            if (itemA > itemB) {
                return -1;
            }

            if (itemA < itemB) {
                return 1;
            }

            return 0;
        });

        return inputData;
    }

    /**
     * Сортировать по логическому полю от false до true
     * @param inputData
     * @param fieldNameStrType
     * @protected
     */
    protected _sortBoolean_FalseTrue(inputData: TItem[], fieldNameStrType: keyof TItem): TItem[] {
        inputData.sort((a: TItem, b: TItem) => {
            const itemTmpA = a[fieldNameStrType];
            const itemTmpB = b[fieldNameStrType];

            const itemA: boolean = (typeof itemTmpA === 'boolean') ? itemTmpA : !!itemTmpA;
            const itemB: boolean = (typeof itemTmpB === 'boolean') ? itemTmpB : !!itemTmpB;

            if (itemA > itemB) {
                return 1;
            }

            if (itemA < itemB) {
                return -1;
            }

            return 0;
        });

        return inputData;
    }

    /**
     * Сортировать по дате, сначала старые
     * @param inputData
     * @param fieldNameDateType
     * @protected
     */
    protected _sortDate_09(inputData: TItem[], fieldNameDateType: keyof TItem): TItem[] {
        inputData.sort((a: TItem, b: TItem) => {
            const itemTmpA: unknown = a[fieldNameDateType];
            const itemTmpB: unknown = b[fieldNameDateType];

            let itemA: number = 0;
            let itemB: number = 0;

            if (itemTmpA) {
                const itemANumber = Number(itemTmpA);
                if (!isNaN(itemANumber)) {
                    itemA = itemANumber;
                }
            } else {
                itemA = Infinity;
            }

            if (itemTmpB) {
                const itemBNumber = Number(itemTmpB);
                if (!isNaN(itemBNumber)) {
                    itemB = itemBNumber;
                }
            } else {
                itemB = Infinity;
            }

            return itemA - itemB;
        });

        return inputData;
    }

    /**
     * Сортировать по дате, сначала новые
     * @param inputData
     * @param fieldNameDateType
     * @protected
     */
    protected _sortDate_90(inputData: TItem[], fieldNameDateType: keyof TItem): TItem[] {
        inputData.sort((a: TItem, b: TItem) => {
            const itemTmpA: unknown = a[fieldNameDateType];
            const itemTmpB: unknown = b[fieldNameDateType];

            let itemA: number = 0;
            let itemB: number = 0;


            if (itemTmpA) {
                const itemANumber = Number(itemTmpA);
                if (!isNaN(itemANumber)) {
                    itemA = itemANumber;
                }
            } else {
                itemA = -Infinity;
            }

            if (itemTmpB) {
                const itemBNumber = Number(itemTmpB);
                if (!isNaN(itemBNumber)) {
                    itemB = itemBNumber;
                }
            } else {
                itemB = -Infinity;
            }

            return itemB - itemA;
        });

        return inputData;
    }

    /**
     * Сортировать по числовому полю сначала меньше
     * @param inputData
     * @param fieldNameStrType
     * @protected
     */
    protected _sortNumber_09(inputData: TItem[], fieldNameStrType: keyof TItem): TItem[] {
        inputData.sort((a: TItem, b: TItem) => {
            const itemTmpA = a[fieldNameStrType];
            const itemTmpB = b[fieldNameStrType];

            const itemA: number = (typeof itemTmpA === 'number') ? itemTmpA : 0;
            const itemB: number = (typeof itemTmpB === 'number') ? itemTmpB : 0;

            if (itemA > itemB) {
                return 1;
            }

            if (itemA < itemB) {
                return -1;
            }

            return 0;
        });

        return inputData;
    }

    /**
     * Сортировать по числовому полю сначала больше
     * @param inputData
     * @param fieldNameStrType
     * @protected
     */
    protected _sortNumber_90(inputData: TItem[], fieldNameStrType: keyof TItem): TItem[] {
        inputData.sort((a: TItem, b: TItem) => {
            const itemTmpA = a[fieldNameStrType];
            const itemTmpB = b[fieldNameStrType];

            const itemA: number = (typeof itemTmpA === 'number') ? itemTmpA : 0;
            const itemB: number = (typeof itemTmpB === 'number') ? itemTmpB : 0;

            if (itemA > itemB) {
                return -1;
            }

            if (itemA < itemB) {
                return 1;
            }

            return 0;
        });

        return inputData;
    }

    //endregion

    /**
     * Поиск по строке
     * @param param
     * @protected
     */
    protected _searchString(param: SearchStringParams<TItem>): TItem[] {
        const result: TItem[] = [];
        const itemsList = param.itemsList;
        const searchQuery: string = param.searchQuery.toLowerCase();
        const fieldsNamesForSearch = param.fieldsNames;

        for (const item of itemsList) {
            for (const fieldName of fieldsNamesForSearch) {
                const valueForSearch: any = item[fieldName];
                const stringForSearch: string = (typeof valueForSearch === 'string') ? valueForSearch.toLowerCase() : String(valueForSearch).toLowerCase();
                if (stringForSearch.indexOf(searchQuery) > -1) {
                    result.push(item);
                    break;
                }
            }
        }

        return result;
    }

    /**
     * Поиск по полям типа массив
     * Если поле содержит хотя бы одно поисковое значение, элемент удовлетворяет поиску
     * @param param
     * @protected
     */
    protected _filterArrayFieldByArrayValues(param: FilterArrayFieldByArrayValuesParams<TItem>): TItem[] {
        const {searchValuesList, fieldsNames, itemsList} = param;

        if (!Array.isArray(searchValuesList)) {
            return itemsList;
        }

        if (!searchValuesList.length) {
            return itemsList;
        }

        if (!itemsList.length) {
            return itemsList;
        }

        const result: TItem[] = [];

        for (const item of itemsList) {
            let isAddItem: boolean = false;
            for (const fieldName of fieldsNames) {
                const tmp = item[fieldName];
                const currentItemValuesList: (string | number)[] = Array.isArray(tmp) ? tmp : [];
                for (const searchValue of searchValuesList) {
                    for (const currentItemValue of currentItemValuesList) {
                        if (currentItemValue === searchValue) {
                            result.push(item);
                            isAddItem = true;
                            break;
                        }
                    }
                    if (isAddItem) {
                        break;
                    }
                }
                if (isAddItem) {
                    break;
                }
            }
        }

        return result;
    }

    /**
     * Поиск по полям имеющим примитивный тип
     * Если значение поле совпадает хотя бы с одним искомым значением, элемент удовлетворяет поиску
     * @param param
     * @protected
     */
    protected _filterByValuesList(param: FilterByValuesListParams<TItem>): TItem[] {
        const {searchValuesList, fieldsNames, itemsList} = param;

        if (!Array.isArray(searchValuesList)) {
            return itemsList;
        }

        if (!searchValuesList.length) {
            return itemsList;
        }

        if (!itemsList.length) {
            return itemsList;
        }

        const result: TItem[] = [];

        for (const item of itemsList) {
            let isAddItem: boolean = false;
            for (const fieldName of fieldsNames) {
                const currentItemValue = item[fieldName];
                for (const value of searchValuesList) {
                    if (currentItemValue === value) {
                        result.push(item);
                        isAddItem = true;
                        break;
                    }
                }
                if (isAddItem) {
                    break;
                }
            }
        }

        return result;
    }

    /**
     * Поиск по полям имеющим примитивный тип
     * Если значение поля совпадает с искомым значением, элемент удовлетворяет поиску
     * @param param
     * @protected
     */
    protected _filterByValue(param: FilterByValueParams<TItem>): TItem[] {
        const {searchValue, fieldsNames, itemsList} = param;

        if (!itemsList.length) {
            return itemsList;
        }

        const result: TItem[] = [];

        for (const item of itemsList) {
            for (const fieldName of fieldsNames) {
                const currentItemValue = item[fieldName];
                if (currentItemValue === searchValue) {
                    result.push(item);
                    break;
                }
            }
        }

        return result;
    }
}
