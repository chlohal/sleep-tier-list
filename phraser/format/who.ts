import { who_opt } from "../../competition/axes";
import { SentenceFragment } from "../sentence";

export function makeWhoQuality(): SentenceFragment {
    return {
        type: "prepositional",
        children: [
            {
                type: "placeholder",
                key: "WHO",
                part: "object"
            }
        ],
        attributes: {
            preposition: "with"
        }
    }

}

export function literalOfWho(who: who_opt | undefined): string {
    if (who === undefined) return "";

    switch (who) {
        case "animal": return "an animal";
        case "friend": return "a friend";
        case "family_member": return "a family member";
        case "romantic_partner": return "a romantic partner";
        case "stuffed_animal": return "a stuffed animal";
        case "someone": return "someone";
    }

}