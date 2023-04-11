import AbstractStorePage from "../src/abstractStorePage";
import StoreSitePageTitle from "../src/storeSitePageTitle";

const storeSitePageTitle = new StoreSitePageTitle();
    storeSitePageTitle.setOptions({
        linkBack: 'linkBack',
        documentTitle: 'documentTitle',
        pageTitle: 'pageTitle'
});

class TestStorePage1 extends AbstractStorePage<string> {
    protected _uniquePageKey: string;

    protected _pageShown() {
        this._setStoreContentPage('Test store');
        this._storeSitePageTitle.setOptions({
            pageTitle: 'current pageTitle',
            documentTitle: 'current documentTitle',
            linkBack: 'current linkBack'
        });
    }

    constructor() {
        super({
            storeSitePageTitle: storeSitePageTitle,
            isForgetDataAfterLeaving: true
        });
        this._uniquePageKey = 'currentPageUniqueKey';
    }
}

class TestStorePage2 extends AbstractStorePage<string> {
    protected _uniquePageKey: string;

    protected _pageShown() {
        this._setStoreContentPage('Test store');
        this._storeSitePageTitle.setOptions({
            pageTitle: 'current pageTitle',
            documentTitle: 'current documentTitle',
            linkBack: 'current linkBack'
        });
    }

    constructor() {
        super({
            storeSitePageTitle: storeSitePageTitle,
            isForgetDataAfterLeaving: false
        });


        this._uniquePageKey = 'currentPageUniqueKey';
    }
}



test('uniquePageKey', () => {
    const storePage = new TestStorePage1();
    expect(storePage.uniquePageKey).toStrictEqual('currentPageUniqueKey');
});

test('storeContentPage not set', () => {
    const storePage = new TestStorePage1();
    expect(storePage.storeContentPage).toStrictEqual(undefined);
});

test('storeContentPage eventPageShown', () => {
    const storePage = new TestStorePage1();
    storePage.eventPageShown();
    expect(storePage.storeContentPage).toStrictEqual('Test store');
});

test('storeContentPage eventPageExit', () => {
    const storePage = new TestStorePage1();
    storePage.eventPageShown();
    storePage.eventPageExit();
    expect(storePage.storeContentPage).toStrictEqual(undefined);
});

test('storeContentPage eventPageExit', () => {
    const storePage = new TestStorePage2();
    storePage.eventPageShown();
    storePage.eventPageExit();
    expect(storePage.storeContentPage).toStrictEqual('Test store');
});