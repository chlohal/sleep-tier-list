

export type GrammarType = "sentence" | "verb" | "object" | "indefinite_article" | "definite_article" |
    "conjuncted_phrase" | "comma_deliminated_list" | "prepositional" | "adjectival" | "adjective" |
    "object" | "phrase" | "indefinite_object" | "dummy_object" | "indefinite_particle"

type SentencePart = {
    type: GrammarType
    children: SentenceFragment[],
    attributes?: { [k: string]: string }
}

const TREATED_AS_OBJECT_IN_ADJECTIVAL: GrammarType[] = ["object", "indefinite_object", "dummy_object", "indefinite_particle"]
const DISSOLVES_ARTICLES: GrammarType[] = ["indefinite_object", "indefinite_particle"];
const DISSOLVES_PREPOSITIONS: GrammarType[] = ["indefinite_particle"];

export type SentenceFragment = SentencePart | LiteralSentencePart | SentencePlaceholder

export type SentencePlaceholder = {
    type: "placeholder",
    part?: GrammarType | "literal",
    key: string
}

type LiteralSentencePart = {
    type: "literal",
    content: string
}

export function replacePlaceholder(sentence: SentenceFragment, key: string, value: string | SentenceFragment | SentenceFragment[] | undefined,
    part?: GrammarType, parent?: SentencePart) {

    if (!value) {
        value = [];
    } else if (typeof value === "string") {
        value = [{
            type: "literal",
            content: value
        }];
    } else if (!(value instanceof Array)) {
        value = [value];
    }

    if (sentence.type == "placeholder") {
        if (sentence.key == key) {
            const s = sentence as SentenceFragment;
            s.type = part || sentence.part || (() => { throw new Error("Unspecified part of speech for placeholder " +  sentence.key) })();

            if (s.type == "literal") {
                parent?.children.splice(parent?.children.findIndex(x => x == sentence), 1, ...value);
            } else {
                (s as SentencePart).children = value;
            }
        }
    } else if (sentence.type != "literal") {
        (sentence as SentencePart).children.forEach(x => replacePlaceholder(x, key, value, part, sentence as SentencePart));
    }
}

export function formatSentence(sentence: SentenceFragment, doHtml = true): string {
    normalizeSentence(sentence);

    return formatNormalizedSentence(sentence, doHtml);
}

function normalizeSentence(sentence: SentenceFragment, parent?: SentencePart): void {
    if (sentence.type == "literal" || sentence.type == "placeholder") return;
    else sentence.children.forEach(x => normalizeSentence(x, sentence));

    sentence.children = sentence.children.flat(1);

    if (!parent) return;

    if(sentence.children.length == 0) {
        dissolve(parent, sentence);
        return;
    }

    switch (sentence.type) {
        case "adjectival":
            const objects = sentence.children.filter(x => x.type != "dummy_object" && TREATED_AS_OBJECT_IN_ADJECTIVAL.includes(x.type as GrammarType)).length;
            if (objects > 0) {
                sentence.children = sentence.children.filter(x=>x.type != "dummy_object");
            }
            if(sentence.children.length == 1 && sentence.children[0].type == "dummy_object") {
                sentence.children = [];
            }
            if(sentence.children.length == 0 || 
                (sentence.children.length == 1 && TREATED_AS_OBJECT_IN_ADJECTIVAL.includes(sentence.children[0].type as GrammarType))
            ) {
                dissolve(parent, sentence);
            }
            return;
        case "prepositional":
            if (sentence.children.length == 1) {
                const childType = sentence.children[0].type;
                if(DISSOLVES_PREPOSITIONS.includes(childType as GrammarType)) {
                    dissolve(parent, sentence);
                }
            }
            return;
        case "indefinite_article":
        case "definite_article":
            if (sentence.children.length == 1) {
                const childType = sentence.children[0].type;
                if(DISSOLVES_ARTICLES.includes(childType as GrammarType) ||
                    childType == sentence.type) {
                    dissolve(parent, sentence);
                }
            }
            return;
        default:
            return;
    }

    let e: never;

    return e;
}

function dissolve(parent: SentencePart, child: SentenceFragment) {
    const index = parent.children.findIndex(x => x == child);

    if (child.type == "literal" || child.type == 'placeholder') {
        //@ts-ignore
        parent.children.splice(index, 1, []);
    } else {
        //@ts-ignore
        parent.children.splice(index, 1, child.children);
    }
}

function formatNormalizedSentence(sentence: SentenceFragment, doHtml: boolean): string {

    if(sentence.type === "placeholder") throw new Error("Unreplaced Placeholder!");

    const content = sentence.type === "literal" ? sentence.content : formatSentencePart(sentence as SentencePart, doHtml);
        
    if("key" in sentence && doHtml) return `<span class="sentence-key ${sentence.key}">${content}</span>`;
    else return content;
}

function andJoin(parts: string[]): string {
    if(parts.length == 0) return "";
    if(parts.length == 1) return parts[0];
    else return parts.slice(0, -2).join(", ") + " and " + parts[parts.length - 1];
}

function formatSentencePart(part: SentencePart, doHtml: boolean): string {
    switch (part.type) {
        case "adjectival":
            const object_index = part.children.findIndex(x=> TREATED_AS_OBJECT_IN_ADJECTIVAL.includes(x.type as GrammarType));

            const pre_adjectives = part.children.slice(0, object_index).map(x=>formatNormalizedSentence(x, doHtml)).join(", ");
            const object = formatNormalizedSentence(part.children[object_index],doHtml);
            const post_adjectives = andJoin(part.children.slice(object_index + 1).map(x=>formatNormalizedSentence(x, doHtml)));

            if(pre_adjectives && object && post_adjectives) return `${pre_adjectives} ${object}, ${post_adjectives}`
            else if(pre_adjectives && object) return `${pre_adjectives} ${object}`;
            else if(post_adjectives && object) return `${object} which is ${post_adjectives}`;
            else if(object) return object;
            else throw new Error("No object in adjectival!");
        case "comma_deliminated_list":
            return part.children.map(x=>formatNormalizedSentence(x, doHtml)).filter(x => x).join(", ");
        case "conjuncted_phrase":
            return formatNormalizedSentence(part.children[0],doHtml) + ", " + part.attributes!.conjunction.toLowerCase() + " " + formatNormalizedSentence(part.children[2], doHtml);
        case "adjective":
            return part.children.map(x=>formatNormalizedSentence(x, doHtml)).join(" ");
        case "definite_article":
            return prefixIfDefiniteWith(part, "the", doHtml);
        case "indefinite_article":
            return prefixIfDefiniteWith(part, child => child.match(/^[aeiou]/i) ? "an" : "a", doHtml);
        case "prepositional":
            return prefixIfDefiniteWith(part, part.attributes!.preposition, doHtml);
        case "indefinite_object":
        case "indefinite_particle":
        case "sentence":
        case "phrase":
        case "object":
        case "dummy_object":
        case "verb": return part.children.map(x=>formatNormalizedSentence(x, doHtml)).filter(x => x).join(" ");
    }
}

function prefixIfDefiniteWith(part: SentencePart, prefix: string | ((child: string) => string), doHtml: boolean) {
    if (part.children.length == 0) return "";
    if (part.children.length != 1) throw new Error("Bad prefixing!");

    const child = formatNormalizedSentence(part.children[0],doHtml);

    if (child == "") return "";

    if (typeof prefix === "function") prefix = prefix(child);

    return prefix + " " + child;
}
