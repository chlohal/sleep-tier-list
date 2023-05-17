import { opt } from "../../axes";
import { GrammarType, SentenceFragment } from "../sentence";


export function literalOfWhat(what: opt<'what'> | undefined): string {
    if (what === undefined) return "";

    switch (what) {
        case "guest_bed": return "guest bed"
        case "queen_bed": return "queen-sized bed";
        case "twin_bed": return "twin-sized bed";
        case "chair": return "chair";
        case "beanbag": return "beanbag";
        case "bench": return "bench";
        case "car_seat": return "car seat";
        case "dog_bed": return "dog bed";
        case "grass": return "patch of grass";
        case "hardwood": return "hardwood flooring";
        case "pavement": return "pavement";
        case "rug": return "rug";
        case "hammock": return "hammock";
        case "stairs": return "staircase";
        case "couch": return "couch";
        case "futon": return "futon";
        case "recliner": return "recliner";
        case "yoga_mat": return "yoga mat";
    }

}

export function typeOfWhere(where: opt<'where'> | undefined): GrammarType {
    if(where === "outside") return "indefinite_particle";
    else return "object";
}

export function literalOfWhere(where: opt<'where'> | undefined): string | SentenceFragment {
    if (where === undefined) return "";

    switch (where) {
        case "dorm_room": return "dorm room";
        case "dorm_common_room": return "common room";
        case "library": return "library";
        case "outside": return "outside";
        case "camping": return "tent";
        case "minivan": return "minivan";
        case "sedan": return "car";
        case "class": return "classroom";
        case "dungeon": return "dungeon";
        case "your_house": return "home";
        case "friends_house": return "house";

    }
}

export function article_type(what: opt<'what'> | undefined): GrammarType {
    if (what == "hardwood" || what == "pavement") return "indefinite_object";
    else return "object"
}

