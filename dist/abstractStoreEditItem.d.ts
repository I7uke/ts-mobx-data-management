type EditorStatusType<Status extends string> = {
    readonly status: Status;
    readonly text?: string;
};
type ItemStatus = 'newItem' | 'existingItem';
type EditorStatus = EditorStatusType<'editItem'> | EditorStatusType<'serverRequest'> | EditorStatusType<'error'> | EditorStatusType<'hide'>;
type CallbackSaveModifiedItem<TItem extends Object> = (item: TItem) => void;
type CallbackCancelEditItem = () => void;
export type InitDataAbstractStoreEditItem<TItem extends Object, TModifiedItem extends Object = TItem> = {
    readonly itemToEdit: TItem;
    readonly itemStatus: ItemStatus;
    readonly editorStatus?: EditorStatus;
    readonly callbackSaveModifiedItem: CallbackSaveModifiedItem<TModifiedItem>;
    readonly callbackCancelEditItem: CallbackCancelEditItem;
};
export default abstract class AbstractStoreEditItem<TItem extends Object, TModifiedItem extends Object = TItem> {
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
     * Сохранить измененный элемент
     * @protected
     */
    protected abstract _saveModifiedItem(): TModifiedItem;
    /**
     * Событие сохранить измененный элемент
     * Если элемент не изменился, будет вызвано событие отмены редактирования
     */
    eventSaveModifiedItem(): void;
    /**
     * Событие отменить редактирование элемента
     */
    eventCancelEditItem(): void;
    protected constructor(initData: InitDataAbstractStoreEditItem<TItem, TModifiedItem>);
}
export {};
