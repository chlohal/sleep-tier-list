import { sleep_opt, temp_opt, what_opt, where_opt, who_opt, AxisPoint } from "../competition/axes";
import { literalOfWhat, literalOfWhere, makeWhereQuality } from "./format/where";
import { literalOfWho, makeWhoQuality } from "./format/who";
import { SentenceFragment, formatSentence, replacePlaceholder, startSentenceWithVerbLy } from "./sentence";

export function phrase(axisPicks: AxisPoint): string {
    const picks = {
        where: undefined as where_opt | undefined,
        what: undefined as what_opt | undefined,
        who: undefined as who_opt | undefined,
        temp: undefined as temp_opt | undefined,
        type: undefined as sleep_opt | undefined
    }

    for (const {axis, value} of axisPicks.dimensions) {
        //@ts-ignore
        picks[axis] = value;
    }

    const qualityList: SentenceFragment = {
        type: "comma_deliminated_list",
        children: []
    }

    const sentence = startSentenceWithVerbLy(sleepVerb(picks.type), qualityList);
    
    qualityList.children.push(makeWhereQuality(picks.what));

    replacePlaceholder(sentence, "TEMPERATURE", tempAdj(picks.temp));
    //If there is a temperature quality, make the place generic. Otherwise, we can safely dissolve the place.
    replacePlaceholder(sentence, "WHERE", literalOfWhere(picks.where) || (picks.temp ? "place" : ""))

    replacePlaceholder(sentence, "WHAT", literalOfWhat(picks.what));


    qualityList.children.push(makeWhoQuality());

    replacePlaceholder(sentence, "WHO", literalOfWho(picks.who));


    //console.log(JSON.stringify(sentence, null, 2));

    return formatSentence(sentence)
}

function sleepVerb(type: sleep_opt | undefined): string {
    switch(type) {
        case "nap": return "Napping";
        case "resting": return "Lying down and resting";
        case "long_nap": return "Taking an hour-long nap";
        case "long_sleep": return "Sleeping a full night";
        default: return "Sleeping";
    }
}
function tempAdj(temp: temp_opt | undefined): string {
    if(temp === undefined) return "";

    switch(temp) {
        case "hot": return "overheated";
        case "cold": return "freezing";
        case "cool": return "cool";
        case "warm": return "warm";
    }
}

