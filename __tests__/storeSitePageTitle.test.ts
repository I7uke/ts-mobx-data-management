import { StoreSitePageTitle } from "../dist";

test('linkBack', () => {
    const storeSitePageTitle = new StoreSitePageTitle();
    storeSitePageTitle.setOptions({
        linkBack: 'linkBack',
        documentTitle: 'documentTitle',
        pageTitle: 'pageTitle'
    });
    expect(storeSitePageTitle.linkBack).toStrictEqual('linkBack');
});

test('documentTitle', () => {
    const storeSitePageTitle = new StoreSitePageTitle();
    storeSitePageTitle.setOptions({
        linkBack: 'linkBack',
        documentTitle: 'documentTitle',
        pageTitle: 'pageTitle'
    });
    expect(storeSitePageTitle.documentTitle).toStrictEqual('documentTitle');
});

test('pageTitle', () => {
    const storeSitePageTitle = new StoreSitePageTitle();
    storeSitePageTitle.setOptions({
        linkBack: 'linkBack',
        documentTitle: 'documentTitle',
        pageTitle: 'pageTitle'
    });
    expect(storeSitePageTitle.pageTitle).toStrictEqual('pageTitle');
});

test('destroy linkBack', () => {
    const storeSitePageTitle = new StoreSitePageTitle();
    storeSitePageTitle.setOptions({
        linkBack: 'linkBack',
        documentTitle: 'documentTitle',
        pageTitle: 'pageTitle'
    });

    storeSitePageTitle.destroy();
    expect(storeSitePageTitle.linkBack).toStrictEqual('');
});

test('destroy documentTitle', () => {
    const storeSitePageTitle = new StoreSitePageTitle();
    storeSitePageTitle.setOptions({
        linkBack: 'linkBack',
        documentTitle: 'documentTitle',
        pageTitle: 'pageTitle'
    });

    storeSitePageTitle.destroy();
    expect(storeSitePageTitle.documentTitle).toStrictEqual('');
});

test('destroy pageTitle', () => {
    const storeSitePageTitle = new StoreSitePageTitle();
    storeSitePageTitle.setOptions({
        linkBack: 'linkBack',
        documentTitle: 'documentTitle',
        pageTitle: 'pageTitle'
    });

    storeSitePageTitle.destroy();
    expect(storeSitePageTitle.pageTitle).toStrictEqual('');
});

test('setOptions linkBack', () => {
    const storeSitePageTitle = new StoreSitePageTitle();
    storeSitePageTitle.setOptions({
        linkBack: 'linkBack',
        documentTitle: 'documentTitle',
        pageTitle: 'pageTitle'
    });

    storeSitePageTitle.setOptions({
        linkBack: 'linkBack change',
    });

    expect(storeSitePageTitle.linkBack).toStrictEqual('linkBack change');
});

test('setOptions documentTitle', () => {
    const storeSitePageTitle = new StoreSitePageTitle();
    storeSitePageTitle.setOptions({
        linkBack: 'linkBack',
        documentTitle: 'documentTitle',
        pageTitle: 'pageTitle'
    });

    storeSitePageTitle.setOptions({
        documentTitle: 'documentTitle change',
    });

    expect(storeSitePageTitle.documentTitle).toStrictEqual('documentTitle change');
});

test('setOptions pageTitle', () => {
    const storeSitePageTitle = new StoreSitePageTitle();
    storeSitePageTitle.setOptions({
        linkBack: 'linkBack',
        documentTitle: 'documentTitle',
        pageTitle: 'pageTitle'
    });

    storeSitePageTitle.setOptions({
        pageTitle: 'pageTitle change',
    });

    expect(storeSitePageTitle.pageTitle).toStrictEqual('pageTitle change');
});