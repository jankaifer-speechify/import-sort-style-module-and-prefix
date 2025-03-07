import { IStyleAPI, IStyleItem } from "import-sort-style";
export declare enum PrefixGroupsPosition {
    beforeAbsolute = "beforeAbsolute",
    beforeBuiltins = "beforeBuiltins",
    beforeRelative = "beforeRelative",
    afterRelative = "afterRelative"
}
export interface Config {
    position: PrefixGroupsPosition;
    groupings: (string | string[])[];
}
export default function (styleApi: IStyleAPI): IStyleItem[];
