import cloneDeep from "lodash.clonedeep";
import {action, computed, makeObservable, observable} from "mobx";
import {sha1} from "object-hash";

type ItemStatus = 'newItem' | 'existingItem';

interface EditorStatusBaseType<TStatus extends string> {
    readonly status: TStatus;
}

type EditorStatusEditItem = EditorStatusBaseType<'editItem'>;
type EditorStatusHide = EditorStatusBaseType<'hide'>;

interface EditorStatusServerRequest extends EditorStatusBaseType<'serverRequest'> {
    readonly loaderText: string;
}

interface EditorStatusError extends EditorStatusBaseType<'error'> {
    readonly errorText: string;
}

type EditorStatus = EditorStatusEditItem | EditorStatusHide | EditorStatusServerRequest | EditorStatusError;


export type CallbackSaveModifiedItemParams<TItem extends Object> = {
    readonly item: TItem;
    readonly status: ItemStatus;
    readonly other?: unknown;
}

type SaveModifiedItemParams<TItem extends Object> = {
    readonly item: TItem;
    readonly status?: ItemStatus;
    readonly other?: unknown;
}

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
    get itemStatus(): ItemStatus {
        return this._itemStatus_observable;
    }

    /**
     * Получить статус элемента
     * @protected
     */
    protected _getItemStatus(): ItemStatus {
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

    /**
     * Измененный элемент
     */
    get modifiedItem(): TModifiedItem {
        return this._getModifiedItemOverride();
    }

    //#region Методы для переопределения
    /**
     * Проверить измененный элемент
     * @protected
     */
    protected _validationModifiedItemOverride() {
        throw new Error('method _validationModifiedItemOverride must be override!');
    }

    /**
     * Измененный элемент
     */
    protected _getModifiedItemOverride(): TModifiedItem {
        throw new Error('method _getModifiedItemOverride must be override!');
    }

    //#endregion

    /**
     * Отменить редактирование элемента
     */
    protected _cancelEditItem() {
        if (typeof this._callbackCancelEditItem !== 'function') {
            throw new Error('_callbackCancelEditItem is not a function');
        }

        this._callbackCancelEditItem();
    }

    /**
     * Вызывать этот метод когда элемент прошел проверку и его нужно сохранить
     * @param params
     *  item - Элемент который нужно сохранить
     *  status - Статус элемента, если не передать, будет автоматически подставлен текущий статус
     * other - Прочее. Может являться чем угодно
     * @protected
     */
    protected _saveModifiedItem(params: SaveModifiedItemParams<TModifiedItem>) {
        const modifiedItem: TModifiedItem = params.item;
        const modifiedItemHash: string = sha1(modifiedItem);
        const itemToEditBeforeChangesHash: string = sha1(this._itemToEditBeforeChanges);

        if (itemToEditBeforeChangesHash === modifiedItemHash) {
            this._cancelEditItem();
            return;
        }

        const callbackSaveModifiedItemParams: CallbackSaveModifiedItemParams<TModifiedItem> = {
            item: params.item,
            status: typeof params.status === 'string' ? params.status : this._itemStatus_observable,
            other: params.other
        };

        this._callbackSaveModifiedItem(callbackSaveModifiedItemParams);
    }

    /**
     * Событие сохранить измененный элемент
     * Если элемент не изменился, будет вызвано событие отмены редактирования
     */
    public eventSaveModifiedItem() {
        if (typeof this._callbackSaveModifiedItem !== 'function') {
            throw new Error('_callbackSaveModifiedItem is not a function');
        }

        // Вызываем метод проверки элемента
        this._validationModifiedItemOverride();
    }

    /**
     * Событие отменить редактирование элемента
     */
    public eventCancelEditItem() {
        this._cancelEditItem();
    }

    constructor(initData: InitDataBaseStoreEditItem<TItem, TModifiedItem>) {
        this.eventSaveModifiedItem = this.eventSaveModifiedItem.bind(this);
        this.eventCancelEditItem = this.eventCancelEditItem.bind(this);

        this._callbackCancelEditItem = initData.callbackCancelEditItem;
        this._callbackSaveModifiedItem = initData.callbackSaveModifiedItem;

        this._itemToEditBeforeChanges = cloneDeep(initData.itemToEdit);
        this._itemStatus_observable = initData.itemStatus;
        this._editorStatus_observable = initData.editorStatus ? initData.editorStatus : {
            status: 'editItem'
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
