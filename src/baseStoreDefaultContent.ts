import { action, computed, makeObservable, observable } from "mobx";

export type InitDataBaseStoreDefaultContent = {
    readonly uniquePageKey: string;
}

export default class BaseStoreDefaultContent {
    protected readonly _uniquePageKey: string;

    public getUniquePageKey() {
        return this._uniquePageKey;
    }

    //#region Ошибка
    private _error_observable?: string;

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

    get error() {
        return this._error_observable;
    }
    //#endregion

    //#region Ссылка редиректа
    /**
     * Ссылка для перенаправления
     */
    private _redirectLink_observable: string;

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

    /**
     * Вызывать перед удалением store
     */
    public beforeRemovingStore() {
    }

    constructor(initData: InitDataBaseStoreDefaultContent) {
        this.serverRequestGetInitData = this.serverRequestGetInitData.bind(this);
        this._redirectLink_observable = '';
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