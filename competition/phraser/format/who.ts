import { opt } from "../../axes";
import { SentenceFragment } from "../sentence";

export function literalOfWho(who: opt<'who'> | undefined): string {
    if (who === undefined) return "";

    switch (who) {
        case "animal": return "an animal";
        case "close_friend": return "a close friend";
        case "non_close_friend": return "a friend";
        case "parent": return "a parent";
        case "sibling": return "a sibling";
        case "romantic_partner": return "a romantic partner";
        case "stuffed_animal": return "a stuffed animal";
    }

}