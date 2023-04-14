import {action, computed, makeObservable, observable} from "mobx";

type InitData = {
    /**
     * Забыть данные после выхода.
     * Если истина, после ухода со страницы все данные будут забыты
     */
    readonly isForgetDataAfterLeaving: boolean;
}

export default abstract class AbstractStorePage<StoreContentPage> {
    protected abstract readonly _uniquePageKey: string;

    get uniquePageKey(): string {
        return this._uniquePageKey;
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
    protected abstract _pageShown(): void;

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

    protected constructor(initData: InitData) {
        this.eventPageExit = this.eventPageExit.bind(this);
        this.eventPageShown = this.eventPageShown.bind(this);
        this._storeContentPage_observable = undefined;
        this._isForgetDataAfterLeaving = initData.isForgetDataAfterLeaving;

        makeObservable<this,
            '_storeContentPage_observable'
            | '_setStoreContentPage'>(this, {
            _storeContentPage_observable: observable.ref,
            _setStoreContentPage: action,
            storeContentPage: computed
        });
    }
}