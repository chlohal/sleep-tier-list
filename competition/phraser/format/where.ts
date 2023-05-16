import { temp_opt, what_opt, where_opt } from "../../axes";
import { GrammarType, SentenceFragment } from "../sentence";

export function makeWhereQuality(what: what_opt | undefined, where: where_opt | undefined, temp: temp_opt | undefined): SentenceFragment {
    return {
        type: "phrase",
        children: [
            {
                type: "prepositional",
                children: [
                    {
                        type: article_type(what),
                        children: [
                            {
                                type: "placeholder",
                                key: "WHAT",
                                part: "object"
                            }
                        ]
                    }
                ],
                attributes: {
                    preposition: prepositionForWhat(what)
                }
            },
            {
                type: temp === undefined && where === "outside" ? "phrase" : "prepositional",
                children: [
                    {
                        type: temp === undefined && where === "outside" ? "phrase" : "indefinite_article",
                        children: [
                            {
                                type: "adjectival",
                                children: [
                                    {
                                        type: "placeholder",
                                        key: "TEMPERATURE",
                                        part: "adjective"
                                    },
                                    temp === undefined && where === "outside" ? { type: "literal", content: "outside" } : {
                                        type: "placeholder",
                                        key: "WHERE",
                                        part: "object"
                                    }
                                ]
                            }
                        ]
                    }
                ],
                attributes: {
                    preposition: "in"
                }
            }

        ]
    }

}

export function literalOfWhat(what: what_opt | undefined): string {
    if(what === undefined) return "";

    switch(what) {
        case "bed": return "bed";
        case "chair": return "chair";
        case "couch": return "couch";
        case "dog_bed": return "dog bed";
        case "grass": return "patch of grass";
        case "hardwood": return "hardwood flooring";
        case "pavement": return "pavement";
        case "rug": return "rug";
        case "hammock": return "hammock";
        case "stairs": return "staircase";
    }
    
}

export function literalOfWhere(where: where_opt | undefined): string {
    if (where === undefined) return "";

    switch (where) {
        case "dorm": return "dorm room";
        case "library": return "library";
        case "outside": return "location outside";
        case "camping": return "tent";
        case "car": return "car";
        case "house": return "house";
    }
}
function prepositionForWhat(what: what_opt | undefined): string {
    switch("what") {

        default: return "on";
    }
}

function article_type(what: what_opt | undefined): GrammarType {
    if(what == "hardwood" || what == "pavement") return "phrase";
    else return "indefinite_article"
}

