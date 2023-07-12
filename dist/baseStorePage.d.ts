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
};
export default class BaseStorePage<StoreContentPage> {
    private _uniquePageKey;
    get uniquePageKey(): string;
    /**
     * Установить уникальный ключ страницы.
     * Ключ можно установить только один раз.
     * Если удалось установить ключ вернет true иначе false
     * @param key - уникальный ключ страницы
     * @protected
     */
    protected _setUniquePageKey(key: string): boolean;
    /**
     * Забыть данные после выхода
     * Если истина, после ухода со страницы все данные будут забыты
     * @protected
     */
    protected _isForgetDataAfterLeaving: boolean;
    private _storeContentPage_observable?;
    protected _setStoreContentPage(store?: StoreContentPage): void;
    get storeContentPage(): StoreContentPage | undefined;
    /**
     * Страница показана
     * @protected
     */
    protected _pageShown(): void;
    /**
     * Уход со страницы
     * @protected
     */
    protected _pageExit(): void;
    /**
     * Событие ухода со страницы
     */
    eventPageExit(): void;
    /**
     * Событие страница показана
     */
    eventPageShown(): void;
    constructor(initData?: InitData);
}
export {};
