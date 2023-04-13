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
};
export default class StoreSitePageTitle {
    private _pageInfo_observable;
    setOptions(params: Partial<PageInfo>): void;
    /**
     * Заголовок страницы
     */
    get pageTitle(): string;
    /**
     * Заголовок вкладки браузера
     */
    get documentTitle(): string;
    /**
     * Ссылка вернуться назад
     */
    get linkBack(): string;
    /**
     * Очищает все данные, возвращает объект в состояние на момент его создания
     */
    destroy(): void;
    constructor();
}
export {};
