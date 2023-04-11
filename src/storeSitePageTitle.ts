import cloneDeep from "lodash.clonedeep";
import {action, computed, makeObservable, observable} from "mobx";

type PageInfo = {
    /**
     * Заголовок страницы
     */
    readonly pageTitle: string;
    /**
     * Заголовок вкладки браузера
     */
    readonly documentTitle: string;
    /**
     * Ссылка вернуться назад
     */
    readonly linkBack: string;
}

function getInitData(): PageInfo {
    return {
        documentTitle: '',
        pageTitle: '',
        linkBack: '',
    };
}

export default class StoreSitePageTitle {

    private _pageInfo_observable: PageInfo;

    public setOptions(params: Partial<PageInfo>) {
        const currentPageInfo: PageInfo = cloneDeep(this._pageInfo_observable);
        this._pageInfo_observable = {
            documentTitle: typeof params.documentTitle === 'string' ? params.documentTitle : currentPageInfo.documentTitle,
            pageTitle: typeof params.pageTitle === 'string' ? params.pageTitle : currentPageInfo.pageTitle,
            linkBack: typeof params.linkBack === 'string' ? params.linkBack : currentPageInfo.linkBack
        };
    }

    /**
     * Заголовок страницы
     */
    get pageTitle(): string {
        return this._pageInfo_observable.pageTitle;
    }

    /**
     * Заголовок вкладки браузера
     */
    get documentTitle(): string {
        return this._pageInfo_observable.documentTitle;
    }

    /**
     * Ссылка вернуться назад
     */
    get linkBack(): string {
        return this._pageInfo_observable.linkBack;
    }

    /**
     * Очищает все данные, возвращает объект в состояние на момент его создания
     */
    public destroy() {
        this._pageInfo_observable = getInitData();
    }

    constructor() {
        this._pageInfo_observable = getInitData();

        makeObservable<this,
            '_pageInfo_observable'>(this, {
            _pageInfo_observable: observable.ref,
            setOptions: action,
            destroy: action,
            pageTitle: computed,
            linkBack: computed,
            documentTitle: computed
        });
    }
}