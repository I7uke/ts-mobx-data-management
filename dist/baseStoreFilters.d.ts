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
};
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
};
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
};
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
};
export default class BaseStoreFilters<TItem extends Object> {
    private _callbackUpdateViewData?;
    /**
     * Событие обновить отображаемые данные
     */
    eventUpdateViewData(): void;
    protected constructor();
    /**
     * Установить callback обновления данных
     * @param callback
     */
    setCallbackUpdateViewData(callback: () => void): void;
    /**
     * Удалить callback обновления данных
     */
    removeCallbackUpdateViewData(): void;
    /**
     * Применить фильтры по порядку
     * @param inputData
     * @param filtersList
     * @protected
     */
    protected _applyFiltersInOrder(inputData: TItem[], filtersList: ((itemsList: TItem[]) => TItem[])[]): TItem[];
    /**
     * Применить фильтры
     * @param inputItems
     * @protected
     */
    protected _applyFiltersOverride(inputItems: TItem[]): TItem[];
    applyFilters(inputItems: TItem[]): TItem[];
    /**
     * Сортировать по строковому полю от A до Z
     * @param inputData
     * @param fieldNameStrType
     * @protected
     */
    protected _sortString_AZ(inputData: TItem[], fieldNameStrType: keyof TItem): TItem[];
    /**
     * Сортировать по строковому полю от Z до А
     * @param inputData
     * @param fieldNameStrType
     * @protected
     */
    protected _sortString_ZA(inputData: TItem[], fieldNameStrType: keyof TItem): TItem[];
    /**
     * Сортировать по логическому полю от true до false
     * @param inputData
     * @param fieldNameStrType
     * @protected
     */
    protected _sortBoolean_TrueFalse(inputData: TItem[], fieldNameStrType: keyof TItem): TItem[];
    /**
     * Сортировать по логическому полю от false до true
     * @param inputData
     * @param fieldNameStrType
     * @protected
     */
    protected _sortBoolean_FalseTrue(inputData: TItem[], fieldNameStrType: keyof TItem): TItem[];
    /**
     * Сортировать по дате, сначала старые
     * @param inputData
     * @param fieldNameDateType
     * @protected
     */
    protected _sortDate_09(inputData: TItem[], fieldNameDateType: keyof TItem): TItem[];
    /**
     * Сортировать по дате, сначала новые
     * @param inputData
     * @param fieldNameDateType
     * @protected
     */
    protected _sortDate_90(inputData: TItem[], fieldNameDateType: keyof TItem): TItem[];
    /**
     * Сортировать по числовому полю сначала меньше
     * @param inputData
     * @param fieldNameStrType
     * @protected
     */
    protected _sortNumber_09(inputData: TItem[], fieldNameStrType: keyof TItem): TItem[];
    /**
     * Сортировать по числовому полю сначала больше
     * @param inputData
     * @param fieldNameStrType
     * @protected
     */
    protected _sortNumber_90(inputData: TItem[], fieldNameStrType: keyof TItem): TItem[];
    /**
     * Поиск по строке
     * @param param
     * @protected
     */
    protected _searchString(param: SearchStringParams<TItem>): TItem[];
    /**
     * Поиск по полям типа массив
     * Если поле содержит хотя бы одно поисковое значение, элемент удовлетворяет поиску
     * @param param
     * @protected
     */
    protected _filterArrayFieldByArrayValues(param: FilterArrayFieldByArrayValuesParams<TItem>): TItem[];
    /**
     * Поиск по полям имеющим примитивный тип
     * Если значение поле совпадает хотя бы с одним искомым значением, элемент удовлетворяет поиску
     * @param param
     * @protected
     */
    protected _filterByValuesList(param: FilterByValuesListParams<TItem>): TItem[];
    /**
     * Поиск по полям имеющим примитивный тип
     * Если значение поля совпадает с искомым значением, элемент удовлетворяет поиску
     * @param param
     * @protected
     */
    protected _filterByValue(param: FilterByValueParams<TItem>): TItem[];
}
export {};
