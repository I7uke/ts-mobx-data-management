import cloneDeep from "lodash.clonedeep";
import {action, computed, makeObservable, observable} from "mobx";
import {sha1} from "object-hash";

type EditorStatusType<Status extends string, > = {
    readonly status: Status;
    readonly text?: string;
}

type ItemStatus = 'newItem' | 'existingItem';
type EditorStatus = EditorStatusType<'editItem'>
    | EditorStatusType<'serverRequest'>
    | EditorStatusType<'error'>
    | EditorStatusType<'hide'>;

type CallbackSaveModifiedItem<TItem extends Object> = (item: TItem) => void;
type CallbackCancelEditItem = () => void;

export type InitDataAbstractStoreEditItem<TItem extends Object, TModifiedItem extends Object = TItem> = {
    readonly itemToEdit: TItem;
    readonly itemStatus: ItemStatus
    readonly editorStatus?: EditorStatus;
    readonly callbackSaveModifiedItem: CallbackSaveModifiedItem<TModifiedItem>;
    readonly callbackCancelEditItem: CallbackCancelEditItem;
}

export default abstract class AbstractStoreEditItem<TItem extends Object, TModifiedItem extends Object = TItem> {
    private readonly _callbackSaveModifiedItem: CallbackSaveModifiedItem<TModifiedItem>;
    private readonly _callbackCancelEditItem: CallbackCancelEditItem;
    private readonly _itemToEditBeforeChanges: TItem;

    //region Статус элемента
    private _itemStatus_observable: ItemStatus;

    /**
     * Установить статус элемента
     * @param status
     */
    public setItemStatus(status: ItemStatus) {
        this._itemStatus_observable = status;
    }

    /**
     * Статус элемента
     */
    get itemStatus() {
        return this._itemStatus_observable;
    }

    //endregion

    //region Статус редактора
    private _editorStatus_observable: EditorStatus;

    /**
     * Установить статус редактора
     * @param status
     */
    public setEditorStatus(status: EditorStatus) {
        this._editorStatus_observable = status;
    }

    /**
     * Статус редактора
     */
    get editorStatus() {
        return this._editorStatus_observable;
    }

    //endregion

    /**
     * Получить исходный элемент для редактирования, без каких либо изменений
     * @protected
     */
    protected _getItemToEditBeforeChanges() {
        return cloneDeep(this._itemToEditBeforeChanges);
    }

    /**
     * Исходный элемент для редактирования, без каких либо изменений
     */
    get itemToEditBeforeChanges() {
        return this._itemToEditBeforeChanges;
    }

    /**
     * Сохранить измененный элемент
     * @protected
     */
    protected abstract _saveModifiedItem(): TModifiedItem

    /**
     * Событие сохранить измененный элемент
     * Если элемент не изменился, будет вызвано событие отмены редактирования
     */
    public eventSaveModifiedItem() {
        if (typeof this._callbackSaveModifiedItem !== 'function') {
            return;
        }

        const modifiedItem: TModifiedItem = this._saveModifiedItem();
        const modifiedItemHash: string = sha1(modifiedItem);
        const itemToEditBeforeChangesHash: string = sha1(this._itemToEditBeforeChanges);

        if (itemToEditBeforeChangesHash === modifiedItemHash) {
            this._callbackCancelEditItem();
            return;
        }

        this._callbackSaveModifiedItem(modifiedItem);
    }

    /**
     * Событие отменить редактирование элемента
     */
    public eventCancelEditItem() {
        if (typeof this._callbackCancelEditItem === 'function') {
            this._callbackCancelEditItem();
        }
    }

    protected constructor(initData: InitDataAbstractStoreEditItem<TItem, TModifiedItem>) {
        this.eventSaveModifiedItem = this.eventSaveModifiedItem.bind(this);
        this.eventCancelEditItem = this.eventCancelEditItem.bind(this);

        this._callbackCancelEditItem = initData.callbackCancelEditItem;
        this._callbackSaveModifiedItem = initData.callbackSaveModifiedItem;

        this._itemToEditBeforeChanges = cloneDeep(initData.itemToEdit);
        this._itemStatus_observable = initData.itemStatus;
        this._editorStatus_observable = initData.editorStatus ? initData.editorStatus : {status: 'editItem'};

        makeObservable<this,
            '_itemStatus_observable'
            | '_editorStatus_observable'>(this, {
            _itemStatus_observable: observable.ref,
            _editorStatus_observable: observable.ref,
            setItemStatus: action,
            setEditorStatus: action,
            itemStatus: computed,
            editorStatus: computed
        });
    }
}
