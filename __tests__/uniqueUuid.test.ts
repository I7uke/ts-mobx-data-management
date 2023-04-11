import UniqueUuid from "../src/uniqueUuid";

test('typeof string', () => {
    const uniqueUuid = new UniqueUuid();
    const uuid = uniqueUuid.getUuid();
    expect(typeof uuid === 'string').toStrictEqual(true);
});

test('unique 100', () => {
    const uniqueUuid = new UniqueUuid();

    const testMap: Map<string, null> = new Map<string, null>();

    for (let i = 0; i < 100; ++i) {
        const uuid = uniqueUuid.getUuid();
        testMap.set(uuid, null)
    }

    expect(testMap.size).toStrictEqual(100);
});

test('unique 5000000', () => {
    const uniqueUuid = new UniqueUuid();

    const testMap: Map<string, null> = new Map<string, null>();

    for (let i = 0; i < 5000000; ++i) {
        const uuid = uniqueUuid.getUuid();
        testMap.set(uuid, null)
    }

    expect(testMap.size).toStrictEqual(5000000);
});