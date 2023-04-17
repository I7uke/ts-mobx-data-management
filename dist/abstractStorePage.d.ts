type InitData = {
    /**
     * Забыть данные после выхода.
     * Если истина, после ухода со страницы все данные будут забыты
     */
    readonly isForgetDataAfterLeaving: boolean;
};
export default abstract class AbstractStorePage<StoreContentPage> {
    protected abstract readonly _uniquePageKey: string;
    get uniquePageKey(): string;
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
    protected abstract _pageShown(): void;
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
    protected constructor(initData: InitData);
}
export {};
