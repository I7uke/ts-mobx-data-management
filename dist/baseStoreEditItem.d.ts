type EditorStatusType<TStatus extends string, TText> = {
    readonly status: TStatus;
    readonly text: TText;
};
type ItemStatus = 'newItem' | 'existingItem';
type EditorStatus = EditorStatusType<'editItem', undefined> | EditorStatusType<'serverRequest', string> | EditorStatusType<'error', string> | EditorStatusType<'hide', undefined>;
export type CallbackSaveModifiedItemParams<TItem extends Object> = {
    readonly item: TItem;
    readonly status: ItemStatus;
    readonly other?: unknown;
};
type CallbackSaveModifiedItem<TItem extends Object> = (params: CallbackSaveModifiedItemParams<TItem>) => void;
type CallbackCancelEditItem = () => void;
export type InitDataBaseStoreEditItem<TItem extends Object, TModifiedItem extends Object = TItem> = {
    readonly itemToEdit: TItem;
    readonly itemStatus: ItemStatus;
    readonly editorStatus?: EditorStatus;
    readonly callbackSaveModifiedItem: CallbackSaveModifiedItem<TModifiedItem>;
    readonly callbackCancelEditItem: CallbackCancelEditItem;
};
export default class BaseStoreEditItem<TItem extends Object, TModifiedItem extends Object = TItem> {
    private readonly _callbackSaveModifiedItem;
    private readonly _callbackCancelEditItem;
    private readonly _itemToEditBeforeChanges;
    private _itemStatus_observable;
    /**
     * Установить статус элемента
     * @param status
     */
    setItemStatus(status: ItemStatus): void;
    /**
     * Статус элемента
     */
    get itemStatus(): ItemStatus;
    private _editorStatus_observable;
    /**
     * Установить статус редактора
     * @param status
     */
    setEditorStatus(status: EditorStatus): void;
    /**
     * Статус редактора
     */
    get editorStatus(): EditorStatus;
    /**
     * Получить исходный элемент для редактирования, без каких либо изменений
     * @protected
     */
    protected _getItemToEditBeforeChanges(): TItem;
    /**
     * Исходный элемент для редактирования, без каких либо изменений
     */
    get itemToEditBeforeChanges(): TItem;
    /**
     * Проверить измененный элемент
     * @protected
     */
    protected _validationModifiedItemOverride(): void;
    /**
     * Отменить редактирование элемента
     */
    protected _cancelEditItem(): void;
    /**
     * Вызывать этот метод когда элемент прошел проверку и его нужно сохранить
     * @param params
     * @protected
     */
    protected _saveModifiedItem(params: CallbackSaveModifiedItemParams<TModifiedItem>): void;
    /**
     * Событие сохранить измененный элемент
     * Если элемент не изменился, будет вызвано событие отмены редактирования
     */
    eventSaveModifiedItem(): void;
    /**
     * Событие отменить редактирование элемента
     */
    eventCancelEditItem(): void;
    protected constructor(initData: InitDataBaseStoreEditItem<TItem, TModifiedItem>);
}
export {};
