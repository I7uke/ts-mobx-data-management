export interface BaseStoreContent {
    readonly getUniquePageKey: ()=> string;
    readonly error: string | undefined
    readonly redirectLink: string | undefined;
    readonly serverRequestGetInitData: () => void;
    readonly beforeRemovingStore: () => void;
    readonly init: () => void;
}