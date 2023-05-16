

export type GrammarType = "sentence" | "verb" | "object" | "indefinite_article" | "definite_article" | "conjuncted_phrase" | "comma_deliminated_list" | "prepositional" | "adjectival" | "adjective" | "object" | "phrase";

type SentencePart = {
    type: GrammarType
    children: SentenceFragment[],
    attributes?: { [k: string]: string }
}

export type SentenceFragment = SentencePart | LiteralSentencePart | SentencePlaceholder

export type SentencePlaceholder = {
    type: "placeholder",
    part: GrammarType | "literal",
    key: string
}

type LiteralSentencePart = {
    type: "literal",
    content: string
}


export function startSentenceWithVerbLy(verb: string, qualities: SentencePart): SentenceFragment {
    return {
        type: "sentence",
        children: [{
            type: "verb",
            children: [
                { type: "literal", content: verb }
            ]
        },
            qualities
        ]
    }
}

export function replacePlaceholder(sentence: SentenceFragment, key: string, value: string, parent?: SentencePart) {
    if (sentence.type == "placeholder") {
        if (sentence.key == key) {
            const s = sentence as SentenceFragment;
            s.type = sentence.part;

            //remove the placeholder if it is not being filled!
            if (value === "") {
                parent?.children.splice(parent?.children.findIndex(x => x == sentence), 1);
                return;
            }

            // @ts-ignore
            delete s.part;
            // @ts-ignore
            delete s.key;

            if (s.type == "literal") {
                s.content = value;
            } else {
                (s as SentencePart).children = [{
                    type: "literal",
                    content: value
                }]
            }
        }
    } else if (sentence.type != "literal") {
        (sentence as SentencePart).children.forEach(x => replacePlaceholder(x, key, value, sentence as SentencePart));
    }
}

export function formatSentence(sentence: SentenceFragment): string {
    switch (sentence.type) {
        case "placeholder": throw new Error("Unreplaced Placeholder!");
        case "literal": return sentence.content;
        default: return formatSentencePart(sentence as SentencePart);
    }
}

function formatSentencePart(part: SentencePart): string {
    switch (part.type) {
        case "adjectival":
            const adjs = part.children.filter(x => x.type == "adjective").map(formatSentence);
            const nonadjs = part.children.filter(x => x.type != "adjective").map(formatSentence);

            if(adjs.length == 0 && nonadjs.length == 0) return "";
            else if(adjs.length == 0) return nonadjs.join(" "); 
            else return adjs.join(", ") + " " + nonadjs.join(" ");

        case "comma_deliminated_list":
            return part.children.map(formatSentence).filter(x=>x).join(", ");
        case "conjuncted_phrase":
            return formatSentence(part.children[0]) + ", " + part.attributes!.conjunction.toLowerCase() + " " + formatSentence(part.children[2]);
        case "adjective":
            return part.children.map(formatSentence).join(" ");
        case "definite_article":
            if(part.children.length == 0) return "";
            if(part.children.length != 1) throw "Bad article!";

            return "the " + formatSentence(part.children[0]);
        case "indefinite_article":
            if(part.children.length == 0) return "";
            if(part.children.length != 1) throw "Bad article!"

            let str = formatSentence(part.children[0]);
            if(str == "") return "";
            else if (str.match(/^[aeiou]/i)) return "an " + str;
            else return "a " + str;
        case "prepositional":
            if(part.children.length == 0) return "";
            if(part.children.length != 1) throw "Bad prepositional!";

            let child = formatSentence(part.children[0]);
            if(child == "") return "";
            return part.attributes!.preposition + " " + child;
        case "sentence":
        case "phrase":
        case "object":
        case "verb": return part.children.map(formatSentence).filter(x=>x).join(" ");
    }
}