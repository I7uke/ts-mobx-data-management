import cloneDeep from "lodash.clonedeep";
import {action, computed, makeObservable, observable} from "mobx";
import {sha1} from "object-hash";

type EditorStatusType<TStatus extends string, TText> = {
    readonly status: TStatus;
    readonly text: TText;
}

type ItemStatus = 'newItem' | 'existingItem';

type EditorStatus = EditorStatusType<'editItem', undefined>
    | EditorStatusType<'serverRequest', string>
    | EditorStatusType<'error', string>
    | EditorStatusType<'hide', undefined>;

export type CallbackSaveModifiedItemParams<TItem extends Object> = {
    readonly item: TItem;
    readonly status: ItemStatus;
    readonly other?: unknown;
};

type CallbackSaveModifiedItem<TItem extends Object> = (params: CallbackSaveModifiedItemParams<TItem>) => void;
type CallbackCancelEditItem = () => void;

export type InitDataBaseStoreEditItem<TItem extends Object, TModifiedItem extends Object = TItem> = {
    readonly itemToEdit: TItem;
    readonly itemStatus: ItemStatus
    readonly editorStatus?: EditorStatus;
    readonly callbackSaveModifiedItem: CallbackSaveModifiedItem<TModifiedItem>;
    readonly callbackCancelEditItem: CallbackCancelEditItem;
}

export default class BaseStoreEditItem<TItem extends Object, TModifiedItem extends Object = TItem> {
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
    protected _getItemToEditBeforeChanges(): TItem {
        return cloneDeep(this._itemToEditBeforeChanges);
    }

    /**
     * Исходный элемент для редактирования, без каких либо изменений
     */
    get itemToEditBeforeChanges() {
        return this._itemToEditBeforeChanges;
    }

    //region Методы для переопределения
    /**
     * Проверить измененный элемент
     * @protected
     */
    protected _validationModifiedItemOverride() {
        throw new Error('method _validationModifiedItemOverride must be override!');
    }

    //endregion

    /**
     * Отменить редактирование элемента
     */
    protected _cancelEditItem() {
        if (typeof this._callbackCancelEditItem === 'function') {
            this._callbackCancelEditItem();
        }
    }

    /**
     * Вызывать этот метод при сохранении элемента
     * @param params
     * @protected
     */
    protected _saveModifiedItem(params: CallbackSaveModifiedItemParams<TModifiedItem>) {
        const modifiedItem: TModifiedItem = params.item;
        const modifiedItemHash: string = sha1(modifiedItem);
        const itemToEditBeforeChangesHash: string = sha1(this._itemToEditBeforeChanges);

        if (itemToEditBeforeChangesHash === modifiedItemHash) {
            if (typeof this._callbackCancelEditItem === 'function') {
                this._callbackCancelEditItem();
            }
            return;
        }

        this._callbackSaveModifiedItem(params);
    }

    /**
     * Событие сохранить измененный элемент
     * Если элемент не изменился, будет вызвано событие отмены редактирования
     */
    public eventSaveModifiedItem() {
        if (typeof this._callbackSaveModifiedItem !== 'function') {
            return;
        }

        // Вызываем метод проверки элемента
        this._validationModifiedItemOverride();
    }

    /**
     * Событие отменить редактирование элемента
     */
    public eventCancelEditItem() {
        if (typeof this._callbackCancelEditItem === 'function') {
            this._callbackCancelEditItem();
        }
    }

    protected constructor(initData: InitDataBaseStoreEditItem<TItem, TModifiedItem>) {
        this.eventSaveModifiedItem = this.eventSaveModifiedItem.bind(this);
        this.eventCancelEditItem = this.eventCancelEditItem.bind(this);

        this._callbackCancelEditItem = initData.callbackCancelEditItem;
        this._callbackSaveModifiedItem = initData.callbackSaveModifiedItem;

        this._itemToEditBeforeChanges = cloneDeep(initData.itemToEdit);
        this._itemStatus_observable = initData.itemStatus;
        this._editorStatus_observable = initData.editorStatus ? initData.editorStatus : {
            status: 'editItem',
            text: undefined
        };

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
