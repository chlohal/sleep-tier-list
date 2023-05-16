import { what_opt, where_opt } from "../../competition/axes";
import { GrammarType, SentenceFragment } from "../sentence";

export function makeWhereQuality(what: what_opt | undefined): SentenceFragment {
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
                type: "prepositional",
                children: [
                    {
                        type: "indefinite_article",
                        children: [
                            {
                                type: "adjectival",
                                children: [
                                    {
                                        type: "placeholder",
                                        key: "TEMPERATURE",
                                        part: "adjective"
                                    },
                                    {
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
        case "beanbag": return "beanbag";
        case "bed": return "bed";
        case "bench": return "bench";
        case "car_seat": return "car seat";
        case "chair": return "chair";
        case "couch": return "couch";
        case "dog_bed": return "dog bed";
        case "grass": return "patch of grass";
        case "hammock": return "hammock";
        case "hardwood": return "hardwood flooring";
        case "pavement": return "pavement";
        case "recliner": return "recliner";
        case "rug": return "rug";
    }
    
}

export function literalOfWhere(where: where_opt | undefined): string {
    if (where === undefined) return "";

    switch (where) {
        case "dorm_room": return "dorm room";
        case "dorm_common_room": return "common room";
        case "library": return "library";
        case "outside": return "location outside";
        case "class": return "classroom";
        case "camping": return "tent";
        case "minivan": return "minivan";
        case "sedan": return "sedan";
        case "house": return "house";
        case "dungeon": return "dungeon";
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

