import {action, computed, makeObservable, observable} from "mobx";

type InitData = {
    /**
     * Забыть данные после выхода.
     * Если истина, после ухода со страницы все данные будут забыты
     */
    readonly isForgetDataAfterLeaving?: boolean;
    /**
     *  Уникальный ключ страницы
     */
    readonly uniquePageKey?: string;
}

export default class BaseStorePage<StoreContentPage> {
    private _uniquePageKey: string;

    get uniquePageKey(): string {
        return this._uniquePageKey;
    }

    /**
     * Установить уникальный ключ страницы.
     * Ключ можно установить только один раз.
     * Если удалось установить ключ вернет true иначе false
     * @param key - уникальный ключ страницы
     * @protected
     */
    protected _setUniquePageKey(key: string): boolean {
        if (typeof key !== 'string') {
            return false;
        }

        if (!key) {
            return false;
        }

        if (this._uniquePageKey) {
            return false;
        }

        this._uniquePageKey = key
        return true;
    }

    /**
     * Забыть данные после выхода
     * Если истина, после ухода со страницы все данные будут забыты
     * @protected
     */
    protected _isForgetDataAfterLeaving: boolean;

    //region Store контента страницы
    private _storeContentPage_observable?: StoreContentPage;

    protected _setStoreContentPage(store?: StoreContentPage) {
        this._storeContentPage_observable = store;
    }

    get storeContentPage() {
        return this._storeContentPage_observable;
    }

    //endregion

    /**
     * Страница показана
     * @protected
     */
    protected _pageShown() {
    }

    /**
     * Уход со страницы
     * @protected
     */
    protected _pageExit() {
        if (this._isForgetDataAfterLeaving) {
            this._setStoreContentPage(undefined);
        }
    }

    /**
     * Событие ухода со страницы
     */
    public eventPageExit() {
        this._pageExit();
    }

    /**
     * Событие страница показана
     */
    public eventPageShown() {
        this._pageShown();
    }

    constructor(initData?: InitData) {
        this.eventPageExit = this.eventPageExit.bind(this);
        this.eventPageShown = this.eventPageShown.bind(this);
        this._storeContentPage_observable = undefined;
        this._isForgetDataAfterLeaving = !!initData?.isForgetDataAfterLeaving;

        let uniquePageKey: string = '';

        if (typeof initData?.uniquePageKey === 'string') {
            if (initData.uniquePageKey) {
                uniquePageKey = initData.uniquePageKey;
            }
        }

        this._uniquePageKey = uniquePageKey;

        makeObservable<this,
            '_storeContentPage_observable'
            | '_setStoreContentPage'>(this, {
            _storeContentPage_observable: observable.ref,
            _setStoreContentPage: action,
            storeContentPage: computed
        });
    }
}