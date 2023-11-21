import {BaseStorePage} from "../dist";

class TestStorePage1 extends BaseStorePage<string> {

    protected override _pageShown() {
        this._setStoreContentPage('Test store');
    }

    constructor() {
        super({
            isForgetDataAfterLeaving: true,
            uniquePageKey: 'currentPageUniqueKey'
        });
    }
}

class TestStorePage2 extends BaseStorePage<string> {
    protected override _pageShown() {
        this._setStoreContentPage('Test store');
    }

    public setUniquePageKey(key: string): boolean {
        return this._setUniquePageKey(key);
    }

    constructor(key?: string) {
        super({
            uniquePageKey: key,
            isForgetDataAfterLeaving: false
        });
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

test('uniquePageKey', () => {
    const storePage = new TestStorePage2();
    expect(storePage.uniquePageKey).toStrictEqual('');
});

test('setUniquePageKey wrong type', () => {
    const storePage = new TestStorePage2();
    // @ts-ignore
    storePage.setUniquePageKey(123);
    expect(storePage.uniquePageKey).toStrictEqual('');
});

test('setUniquePageKey', () => {
    const storePage = new TestStorePage2();
    storePage.setUniquePageKey('testUniquePageKey');
    expect(storePage.uniquePageKey).toStrictEqual('testUniquePageKey');
});

test('setUniquePageKey', () => {
    const storePage = new TestStorePage2();
    storePage.setUniquePageKey('testUniquePageKey1');
    storePage.setUniquePageKey('testUniquePageKey2');
    storePage.setUniquePageKey('testUniquePageKey3');
    expect(storePage.uniquePageKey).toStrictEqual('testUniquePageKey1');
});

test('setUniquePageKey', () => {
    const storePage = new TestStorePage2();
    const result: boolean[] = [
        storePage.setUniquePageKey('testUniquePageKey1'),
        storePage.setUniquePageKey('testUniquePageKey2'),
        storePage.setUniquePageKey('testUniquePageKey3')
    ];

    expect(result).toStrictEqual([true, false, false]);
});

test('setUniquePageKey', () => {
    const storePage = new TestStorePage2();
    const result: boolean[] = [
        storePage.setUniquePageKey(''),
        storePage.setUniquePageKey('testUniquePageKey2'),
        storePage.setUniquePageKey('testUniquePageKey3')
    ];

    expect(result).toStrictEqual([false, true, false]);
});

test('setUniquePageKey', () => {
    const storePage = new TestStorePage2();
    storePage.setUniquePageKey('');
    storePage.setUniquePageKey('testUniquePageKey2');
    storePage.setUniquePageKey('testUniquePageKey3');
    expect(storePage.uniquePageKey).toStrictEqual('testUniquePageKey2');
});

test('setUniquePageKey', () => {
    const storePage = new TestStorePage2('testUniquePageKey0');
    storePage.setUniquePageKey('testUniquePageKey1');
    storePage.setUniquePageKey('testUniquePageKey2');
    storePage.setUniquePageKey('testUniquePageKey3');
    expect(storePage.uniquePageKey).toStrictEqual('testUniquePageKey0');
});

test('setUniquePageKey', () => {
    const storePage = new TestStorePage2('testUniquePageKey0');
    const result: boolean[] = [
        storePage.setUniquePageKey('testUniquePageKey1'),
        storePage.setUniquePageKey('testUniquePageKey2'),
        storePage.setUniquePageKey('testUniquePageKey3')
    ];
    expect(result).toStrictEqual([false, false, false]);
});