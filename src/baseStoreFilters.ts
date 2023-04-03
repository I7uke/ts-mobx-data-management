type SearchStringParams<TItem extends Object> = {
    readonly itemsList: TItem[];
    readonly fieldsNames: (keyof TItem)[];
    readonly searchQuery: string;
}

type FilterByValuesParams<TItem extends Object> = {
    readonly itemsList: TItem[];
    readonly values: (string | number)[];
    readonly fieldsNames: (keyof TItem)[];
}

type FilterByValueParams<TItem extends Object> = {
    readonly itemsList: TItem[];
    readonly value: string | number;
    readonly fieldsNames: (keyof TItem)[];
}

export abstract class AbstractStoreFilters<TItem extends Object> {
    protected _callbackUpdateViewData?: () => void;

    protected _eventUpdateViewData() {
        if (typeof this._callbackUpdateViewData === 'function') {
            this._callbackUpdateViewData();
        }
    }

    constructor() {
        this.applyFilters = this.applyFilters.bind(this);
        this._eventUpdateViewData = this._eventUpdateViewData.bind(this);
        this._callbackUpdateViewData = undefined;
    }

    public setCallbackUpdateViewData(callback: () => void) {
        this._callbackUpdateViewData = callback;
    }

    public resetCallbackUpdateViewData() {
        this._callbackUpdateViewData = undefined;
    }

    protected _applyAllFilters(inputData: TItem[], filtersList: ((itemsList: TItem[]) => TItem[])[]): TItem[] {
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
    protected abstract _applyFilters(inputItems: TItem[]): TItem[]

    public applyFilters(inputItems: TItem[]): TItem[] {
        return this._applyFilters(inputItems);
    }

    //region Сортировки
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

    protected _sortDate_09(inputData: TItem[], fieldNameDateType: keyof TItem): TItem[] {
        inputData.sort((a: TItem, b: TItem) => {
            const itemTmpA: unknown  = a[fieldNameDateType];
            const itemTmpB: unknown = b[fieldNameDateType];

            let itemA: number = 0;
            let itemB: number = 0;


            if(itemTmpA) {
                const itemANumber = Number(itemTmpA);
                if(!isNaN(itemANumber)) {
                    itemA = itemANumber;
                }
            } else {
                itemA = Infinity;
            }

            if(itemTmpB) {
                const itemBNumber = Number(itemTmpB);
                if(!isNaN(itemBNumber)) {
                    itemA = itemBNumber;
                }
            } else {
                itemB = Infinity;
            }

            return itemA - itemB;
        });

        return inputData;
    }

    protected _sortDate_90(inputData: TItem[], fieldNameDateType: keyof TItem): TItem[] {
        inputData.sort((a: TItem, b: TItem) => {
            const itemTmpA = Number(a[fieldNameDateType]);
            const itemTmpB = Number(b[fieldNameDateType]);

            const itemA: number = isNaN(itemTmpA) ? Infinity : itemTmpA;
            const itemB: number = isNaN(itemTmpB) ? Infinity : itemTmpB;

            return itemB - itemA;
        });

        return inputData;
    }

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

    protected _searchString(param: SearchStringParams<TItem>): TItem[] {
        const result: TItem[] = [];
        const itemsList = param.itemsList;
        const searchQuery: string = param.searchQuery.toLowerCase();
        const fieldsNamesForSearch = param.fieldsNames;

        for (const item of itemsList) {
            for (const fieldName of fieldsNamesForSearch) {
                const valueForSearch = item[fieldName];
                const stringForSearch: string = (typeof valueForSearch === 'string') ? valueForSearch.toLowerCase() : String(valueForSearch).toLowerCase();
                if (stringForSearch.indexOf(searchQuery) > -1) {
                    result.push(item);
                    break;
                }
            }
        }

        return result;
    }

    protected _filterByValues(param: FilterByValuesParams<TItem>): TItem[] {
        const {values, fieldsNames, itemsList} = param;

        if (!Array.isArray(values)) {
            return itemsList;
        }

        if (!values.length) {
            return itemsList;
        }

        if (!itemsList.length) {
            return itemsList;
        }

        const result: TItem[] = [];

        for (const item of itemsList) {
            for (const fieldName of fieldsNames) {
                const currentItemValue = item[fieldName];
                let isAddItem: boolean = false;
                for (const value of values) {
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

    protected _filterByValue(param: FilterByValueParams<TItem>): TItem[] {
        const {value, fieldsNames, itemsList} = param;

        if (!itemsList.length) {
            return itemsList;
        }

        const result: TItem[] = [];

        for (const item of itemsList) {
            for (const fieldName of fieldsNames) {
                const currentItemValue = item[fieldName];
                if (currentItemValue === value) {
                    result.push(item);
                    break;
                }
            }
        }

        return result;
    }
}
