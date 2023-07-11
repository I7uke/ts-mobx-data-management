export type InitDataBaseStoreContent = {
    readonly uniquePageKey: string;
};
export default class BaseStoreContent {
    protected readonly _uniquePageKey: string;
    getUniquePageKey(): string;
    private _error_observable?;
    protected _setError(error: string): void;
    protected _removeError(): void;
    get error(): string | undefined;
    /**
     * Ссылка для перенаправления
     */
    private _redirectLink_observable;
    /**
     * Установить ссылку для перенаправления
     * @param link
     * @protected
     */
    protected _setRedirectLink(link: string): void;
    /**
     * Ссылка для перенаправления
     */
    get redirectLink(): string;
    protected _serverRequestGetInitDataOverride(): void;
    /**
    * Запрос на сервер, получить начальное состояние хранилища
    */
    serverRequestGetInitData(): void;
    constructor(initData: InitDataBaseStoreContent);
}
