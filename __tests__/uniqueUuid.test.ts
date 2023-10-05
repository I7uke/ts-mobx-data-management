import getUniqueUuid from "../src/getUniqueUuid";

test('typeof string', () => {
    const uuid = getUniqueUuid();
    expect(typeof uuid === 'string').toStrictEqual(true);
});

test('unique 100', () => {
    const testMap: Map<string, null> = new Map<string, null>();

    for (let i = 0; i < 100; ++i) {
        const uuid = getUniqueUuid();
        testMap.set(uuid, null)
    }

    expect(testMap.size).toStrictEqual(100);
});

test('unique 5000000', () => {
    const uniqueUuid = getUniqueUuid();

    const testMap: Map<string, null> = new Map<string, null>();

    for (let i = 0; i < 5000000; ++i) {
        const uuid = getUniqueUuid();
        testMap.set(uuid, null)
    }

    expect(testMap.size).toStrictEqual(5000000);
});