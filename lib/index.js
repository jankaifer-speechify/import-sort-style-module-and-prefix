"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var PrefixGroupsPosition;
(function (PrefixGroupsPosition) {
    PrefixGroupsPosition["beforeAbsolute"] = "beforeAbsolute";
    PrefixGroupsPosition["beforeBuiltins"] = "beforeBuiltins";
    PrefixGroupsPosition["beforeRelative"] = "beforeRelative";
    PrefixGroupsPosition["afterRelative"] = "afterRelative";
})(PrefixGroupsPosition = exports.PrefixGroupsPosition || (exports.PrefixGroupsPosition = {}));
function assertNever(_) { }
let resolvedConfig;
const getConfig = () => {
    if (resolvedConfig === undefined) {
        const config = {
            isEmpty: false,
            config: {
                position: PrefixGroupsPosition.beforeRelative,
                groupings: [
                    [
                        "assets/",
                        "components/",
                        "config/",
                        "css/",
                        "hooks/",
                        "interfaces/",
                        "lib/",
                        "modules/",
                        "pages/",
                        "store/",
                        "storybook/",
                        "utils/",
                        "wrappers/"
                    ]
                ]
            }
        };
        const defaultConfig = {
            position: PrefixGroupsPosition.beforeRelative,
            groupings: []
        };
        if (config === null ||
            config.isEmpty ||
            typeof config.config !== "object") {
            resolvedConfig = defaultConfig;
        }
        else {
            const mergedConfig = Object.assign({}, defaultConfig);
            if (Object.values(PrefixGroupsPosition).includes(config.config.position)) {
                mergedConfig.position = config.config.position;
            }
            if (Array.isArray(config.config.groupings)) {
                mergedConfig.groupings = (config.config.groupings || [])
                    .map((v) => Array.isArray(v)
                    ? v.filter((v) => typeof v === "string")
                    : v)
                    .filter((v) => (Array.isArray(v) && v.length > 0) || typeof v === "string");
            }
            resolvedConfig = mergedConfig;
        }
    }
    return resolvedConfig;
};
const constructMatchers = ({ moduleName, startsWith }, groupings) => {
    return groupings.map((v) => {
        if (Array.isArray(v)) {
            return moduleName(startsWith(...v));
        }
        else {
            return moduleName(startsWith(v));
        }
    });
};
function default_1(styleApi) {
    const { alias, not, and, or, dotSegmentCount, hasNoMember, isAbsoluteModule, isNodeModule, isRelativeModule, moduleName, naturally, unicode } = styleApi;
    const config = getConfig();
    const matchers = constructMatchers(styleApi, config.groupings);
    const negativeMatcher = not(or(...matchers));
    const hasMemberStyleItems = matchers
        .map(matcher => [
        {
            match: matcher,
            sort: [dotSegmentCount, moduleName(naturally)],
            sortNamedMembers: alias(unicode)
        },
        { separator: true }
    ])
        .reduce((acc, item) => [...acc, ...item], []);
    const noMemberStyleItems = hasMemberStyleItems.map((_a) => {
        var { sortNamedMembers } = _a, item = __rest(_a, ["sortNamedMembers"]);
        return item.match !== undefined
            ? Object.assign(Object.assign({}, item), { sort: [moduleName(naturally)], match: and(hasNoMember, item.match) }) : item;
    });
    const styleItems = [noMemberStyleItems, hasMemberStyleItems];
    let beforeNoMemberAbsolute = [], beforeNoMemberRelative = [], beforeBuiltins = [], beforeAbsolute = [], beforeRelative = [], afterRelative = [];
    switch (config.position) {
        case PrefixGroupsPosition.beforeBuiltins:
            [beforeNoMemberAbsolute, beforeBuiltins] = styleItems;
            break;
        case PrefixGroupsPosition.beforeAbsolute:
            [beforeNoMemberAbsolute, beforeAbsolute] = styleItems;
            break;
        case PrefixGroupsPosition.beforeRelative:
            [beforeNoMemberRelative, beforeRelative] = styleItems;
            break;
        case PrefixGroupsPosition.afterRelative:
            [beforeBuiltins, afterRelative] = styleItems;
            break;
        default:
            assertNever(config.position);
    }
    return [
        ...beforeNoMemberAbsolute,
        { match: and(hasNoMember, isAbsoluteModule, negativeMatcher) },
        { separator: true },
        ...beforeNoMemberRelative,
        { match: and(hasNoMember, isRelativeModule, negativeMatcher) },
        { separator: true },
        ...beforeBuiltins,
        {
            match: isNodeModule,
            sort: moduleName(naturally),
            sortNamedMembers: alias(unicode)
        },
        { separator: true },
        ...beforeAbsolute,
        {
            match: and(isAbsoluteModule, negativeMatcher),
            sort: moduleName(naturally),
            sortNamedMembers: alias(unicode)
        },
        { separator: true },
        ...beforeRelative,
        {
            match: and(isRelativeModule, negativeMatcher),
            sort: [dotSegmentCount, moduleName(naturally)],
            sortNamedMembers: alias(unicode)
        },
        { separator: true },
        ...afterRelative,
        {
            sort: [dotSegmentCount, moduleName(naturally)],
            sortNamedMembers: alias(unicode)
        },
        { separator: true }
    ];
}
exports.default = default_1;
