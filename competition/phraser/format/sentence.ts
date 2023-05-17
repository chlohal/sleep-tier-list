import { SentenceFragment } from "../sentence";

export default function sentenceTemplate(): SentenceFragment {
    return {
        type: "sentence",
        children: [{
            type: "verb",
            children: [
                { type: "placeholder", part: "literal", key: "TYPE" }
            ]
        },
        {
            type: "comma_deliminated_list",
            children: [{
                type: "phrase",
                children: [
                    {
                        type: "prepositional",
                        children: [
                            {
                                type: "indefinite_article",
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
                            preposition: "on"
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
                                                key: "NOISE",
                                                part: "adjective"
                                            },
                                            {
                                                type: "placeholder",
                                                key: "LIGHT",
                                                part: "adjective"
                                            },
                                            {
                                                type: "placeholder",
                                                key: "TEMPERATURE",
                                                part: "adjective"
                                            },
                                            {
                                                type: "dummy_object",
                                                children: [{
                                                    type: "literal",
                                                    content: "place"
                                                }]
                                            },
                                            {
                                                type: "placeholder",
                                                key: "WHERE"
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
            },
            {
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
            }]
        }
        ]
    };
}