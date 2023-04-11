import {v4 as uuidv4} from "uuid";

export default class UniqueUuid {
    private _uuidIndex: number;

    public getUuid(): string {
        return `${uuidv4()}_${++this._uuidIndex}`;
    }

    constructor() {
        this._uuidIndex = 0;
    }
}