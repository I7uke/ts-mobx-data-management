import { action, computed, makeObservable, observable } from "mobx";
import { BaseStoreContent } from "./models/baseStoreContent";

export type InitDataBaseStoreDefaultContent = {
    readonly uniquePageKey: string;
}

export default class BaseStoreDefaultContent implements BaseStoreContent {
    protected readonly _uniquePageKey: string;

    public getUniquePageKey(): string {
        return this._uniquePageKey;
    }

    //#region Ошибка
    private _error_observable: string | undefined;

    protected _setError(error: string) {
        if (typeof error !== 'string') {
            return;
        }

        if (!error) {
            return;
        }

        this._error_observable = error;
    }

    protected _removeError() {
        this._error_observable = undefined;
    }

    get error(): string | undefined {
        return this._error_observable;
    }
    //#endregion

    //#region Ссылка редиректа
    /**
     * Ссылка для перенаправления
     */
    private _redirectLink_observable: string | undefined;

    /**
     * Установить ссылку для перенаправления
     * @param link
     * @protected
     */
    protected _setRedirectLink(link: string) {
        if (typeof link !== 'string') {
            this._redirectLink_observable = '';
            return;
        }

        this._redirectLink_observable = link;
    }

    /**
     * Ссылка для перенаправления
     */
    get redirectLink() {
        return this._redirectLink_observable;
    }
    //#endregion

    protected _serverRequestGetInitDataOverride(): void {
        throw new Error('method _serverRequestGetInitDataOverride must be override');
    }

    /**
    * Запрос на сервер, получить начальное состояние хранилища
    */
    public serverRequestGetInitData(): void {
        this._serverRequestGetInitDataOverride();
    }

    //#region beforeRemovingStore
    protected _beforeRemovingStoreOverride() {
    }

    /**
     * Вызывать перед удалением store
     */
    public beforeRemovingStore(): void {
        this._beforeRemovingStoreOverride();
    }
    //#endregion

    //#region init
    protected _initOverride(): void {
    }

    /**
     * Вызывать для инициализации
     */
    public init(): void {
        this._initOverride();
    }
    //#endregion

    constructor(initData: InitDataBaseStoreDefaultContent) {
        this.serverRequestGetInitData = this.serverRequestGetInitData.bind(this);
        this.beforeRemovingStore = this.beforeRemovingStore.bind(this);
        this.init = this.init.bind(this);
        this._redirectLink_observable = undefined;
        this._error_observable = undefined;
        this._uniquePageKey = initData.uniquePageKey;

        makeObservable<this,
            | '_redirectLink_observable'
            | '_setRedirectLink'
            | '_error_observable'
            | '_setError'
            | '_removeError'>(this, {
            _redirectLink_observable: observable.ref,
            _error_observable: observable.ref,
            _setRedirectLink: action,
            _setError: action,
            _removeError: action,
            redirectLink: computed,
            error: computed,
        });
    }
}