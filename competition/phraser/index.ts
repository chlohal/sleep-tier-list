import axes, { AxisPoint, opt } from "../axes";
import sentenceTemplate from "./format/sentence";
import { article_type, literalOfWhat, literalOfWhere, typeOfWhere } from "./format/where";
import { literalOfWho } from "./format/who";
import { SentenceFragment, formatSentence, replacePlaceholder } from "./sentence";

export function phrase(axisPicks: AxisPoint, doHtml = true): string {
    const picks: { -readonly [P in keyof typeof axes]: (typeof axes[P][number]) | undefined; } = {
        where: undefined,
        what: undefined,
        who: undefined,
        temp: undefined,
        noise: undefined,
        light: undefined,
        type: undefined
    };

    for (const {axis, value} of axisPicks.dimensions) {
        //@ts-ignore
        picks[axis] = value
    }

    const sentence = sentenceTemplate();
    
    replacePlaceholder(sentence, "TYPE", sleepVerb(picks.type));

    replacePlaceholder(sentence, "TEMPERATURE", tempAdj(picks.temp));
    replacePlaceholder(sentence, "WHERE", literalOfWhere(picks.where), typeOfWhere(picks.where));

    replacePlaceholder(sentence, "WHAT", literalOfWhat(picks.what), article_type(picks.what));

    replacePlaceholder(sentence, "NOISE", literalOfNoise(picks.noise));
    replacePlaceholder(sentence, "LIGHT", literalOfLight(picks.light));

    replacePlaceholder(sentence, "WHO", literalOfWho(picks.who));

    return formatSentence(sentence, doHtml)
}

function sleepVerb(type: opt<'type'> | undefined): SentenceFragment[] {
    if(type === undefined) return [{type: "literal", content: "Sleeping"} as any]

    switch(type) {
        case "cuddling": return [{type: "literal", key: "TYPE", content: "Cuddling"} as any];
        case "long_nap": return [{type: "literal", content: "Taking a"}, {type: "literal", key: "TYPE", content: "long nap"} as any];
        case "short_rest": return [{type: "literal", key: "TYPE", content: "Resting"} as any, {type: "literal", content: "briefly"}];
        case "nap": return  [{type: "literal", key: "TYPE", content: "Napping"} as any];
        case "long_sleep": return [{type: "literal", content: "Sleeping"}, {type: "literal", key: "TYPE", content: "a full night"} as any];
    }
}
function tempAdj(temp: opt<'temp'> | undefined): string {
    if(temp === undefined) return "";

    switch(temp) {
        case "cool": return "cool";
        case "hot": return "overheated";
        case "cold": return "frigid";
        case "warm": return "warm";
    }
}

function literalOfNoise(noise: opt<'noise'> | undefined): string {
    if(noise === undefined) return "";

    switch(noise) {
        case "loud": return "noisy";
        case "uproar": return "busy";
        case "silent": return "silent";
        case "quiet": return "calm";
    }
}

function literalOfLight(light: opt<'light'> | undefined): string {
    if(light === undefined) return "";

    switch(light) {
        case "bright": return "well-lit";
        case "dark": return "dark";
        case "moody": return "dim";
        case "incandescent": return "brightly lit";
        case "pitch_black": return "pitch-black";
    }
}

