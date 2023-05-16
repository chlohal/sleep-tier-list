// competition/phraser/util.ts
function shuffle(aOriginal) {
  const a = aOriginal.slice();
  for (let i = a.length; i-- > 1; ) {
    const j = Math.round(Math.random() * i);
    const temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }
  return a;
}
function randomIndex(a) {
  return Math.floor(Math.random() * a.length);
}
function bitsRequired(a) {
  return Math.ceil(Math.log2(a.length));
}

// competition/axes.ts
var axes = {
  "axes": {
    "where_sleeping": [
      "dorm",
      "library",
      "outside",
      "camping",
      "car",
      "house"
    ],
    "what_sleeping_on": [
      "bed",
      "grass",
      "dog_bed",
      "rug",
      "couch",
      "hardwood",
      "pavement",
      "chair"
    ],
    "who_sleeping_with": [
      "friend",
      "romantic_partner",
      "family_member",
      "animal",
      "stuffed_animal",
      "someone"
    ],
    "temperature": [
      "hot",
      "warm",
      "cold"
    ],
    "sleep_type": [
      "nap",
      "resting",
      "long_sleep"
    ]
  }
};
var shortnames = {
  where_sleeping: "where",
  what_sleeping_on: "what",
  who_sleeping_with: "who",
  temperature: "temp",
  sleep_type: "type"
};
function random_axes(num) {
  return shuffle(Object.keys(axes.axes)).slice(0, num);
}
var axis_bit_points = {
  where_sleeping: bitsRequired(axes.axes.what_sleeping_on) + bitsRequired(axes.axes.who_sleeping_with) + bitsRequired(axes.axes.temperature) + bitsRequired(axes.axes.sleep_type) + 4,
  what_sleeping_on: bitsRequired(axes.axes.who_sleeping_with) + bitsRequired(axes.axes.temperature) + bitsRequired(axes.axes.sleep_type) + 3,
  who_sleeping_with: bitsRequired(axes.axes.temperature) + bitsRequired(axes.axes.sleep_type) + 2,
  temperature: bitsRequired(axes.axes.sleep_type) + 1,
  sleep_type: 0
};
function random_with_axes(specific_axes) {
  let id = 0;
  const axis_point = specific_axes.map((x) => {
    const values = axes.axes[x];
    const index = randomIndex(values);
    id |= index + 1 << axis_bit_points[x];
    return {
      axis: shortnames[x],
      value: axes.axes[x][index]
    };
  });
  return {
    dimensions: axis_point,
    id
  };
}

// competition/phraser/format/where.ts
function makeWhereQuality(what) {
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
  };
}
function literalOfWhat(what) {
  if (what === void 0)
    return "";
  switch (what) {
    case "bed":
      return "bed";
    case "chair":
      return "chair";
    case "couch":
      return "couch";
    case "dog_bed":
      return "dog bed";
    case "grass":
      return "patch of grass";
    case "hardwood":
      return "hardwood flooring";
    case "pavement":
      return "pavement";
    case "rug":
      return "rug";
  }
}
function literalOfWhere(where) {
  if (where === void 0)
    return "";
  switch (where) {
    case "dorm":
      return "college dorm room";
    case "library":
      return "library";
    case "outside":
      return "location outside";
    case "camping":
      return "tent";
    case "car":
      return "car";
    case "house":
      return "house";
  }
}
function prepositionForWhat(what) {
  switch ("what") {
    default:
      return "on";
  }
}
function article_type(what) {
  if (what == "hardwood" || what == "pavement")
    return "phrase";
  else
    return "indefinite_article";
}

// competition/phraser/format/who.ts
function makeWhoQuality() {
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
  };
}
function literalOfWho(who) {
  if (who === void 0)
    return "";
  switch (who) {
    case "animal":
      return "an animal";
    case "friend":
      return "a friend";
    case "family_member":
      return "a family member";
    case "romantic_partner":
      return "a romantic partner";
    case "stuffed_animal":
      return "a stuffed animal";
    case "someone":
      return "someone";
  }
}

// competition/phraser/sentence/index.ts
function startSentenceWithVerbLy(verb, qualities) {
  return {
    type: "sentence",
    children: [
      {
        type: "verb",
        children: [
          { type: "literal", content: verb }
        ]
      },
      qualities
    ]
  };
}
function replacePlaceholder(sentence, key, value, parent) {
  if (sentence.type == "placeholder") {
    if (sentence.key == key) {
      const s = sentence;
      s.type = sentence.part;
      if (value === "") {
        parent?.children.splice(parent?.children.findIndex((x) => x == sentence), 1);
        return;
      }
      delete s.part;
      delete s.key;
      if (s.type == "literal") {
        s.content = value;
      } else {
        s.children = [{
          type: "literal",
          content: value
        }];
      }
    }
  } else if (sentence.type != "literal") {
    sentence.children.forEach((x) => replacePlaceholder(x, key, value, sentence));
  }
}
function formatSentence(sentence) {
  switch (sentence.type) {
    case "placeholder":
      throw new Error("Unreplaced Placeholder!");
    case "literal":
      return sentence.content;
    default:
      return formatSentencePart(sentence);
  }
}
function formatSentencePart(part) {
  switch (part.type) {
    case "adjectival":
      const adjs = part.children.filter((x) => x.type == "adjective").map(formatSentence);
      const nonadjs = part.children.filter((x) => x.type != "adjective").map(formatSentence);
      if (adjs.length == 0 && nonadjs.length == 0)
        return "";
      else if (adjs.length == 0)
        return nonadjs.join(" ");
      else
        return adjs.join(", ") + " " + nonadjs.join(" ");
    case "comma_deliminated_list":
      return part.children.map(formatSentence).filter((x) => x).join(", ");
    case "conjuncted_phrase":
      return formatSentence(part.children[0]) + ", " + part.attributes.conjunction.toLowerCase() + " " + formatSentence(part.children[2]);
    case "adjective":
      return part.children.map(formatSentence).join(" ");
    case "definite_article":
      if (part.children.length == 0)
        return "";
      if (part.children.length != 1)
        throw "Bad article!";
      return "the " + formatSentence(part.children[0]);
    case "indefinite_article":
      if (part.children.length == 0)
        return "";
      if (part.children.length != 1)
        throw "Bad article!";
      let str = formatSentence(part.children[0]);
      if (str == "")
        return "";
      else if (str.match(/^[aeiou]/i))
        return "an " + str;
      else
        return "a " + str;
    case "prepositional":
      if (part.children.length == 0)
        return "";
      if (part.children.length != 1)
        throw "Bad prepositional!";
      let child = formatSentence(part.children[0]);
      if (child == "")
        return "";
      return part.attributes.preposition + " " + child;
    case "sentence":
    case "phrase":
    case "object":
    case "verb":
      return part.children.map(formatSentence).filter((x) => x).join(" ");
  }
}

// competition/phraser/index.ts
function phrase(axisPicks) {
  const picks = {
    where: void 0,
    what: void 0,
    who: void 0,
    temp: void 0,
    type: void 0
  };
  for (const { axis, value } of axisPicks.dimensions) {
    picks[axis] = value;
  }
  const qualityList = {
    type: "comma_deliminated_list",
    children: []
  };
  const sentence = startSentenceWithVerbLy(sleepVerb(picks.type), qualityList);
  qualityList.children.push(makeWhereQuality(picks.what));
  replacePlaceholder(sentence, "TEMPERATURE", tempAdj(picks.temp));
  replacePlaceholder(sentence, "WHERE", literalOfWhere(picks.where) || (picks.temp ? "place" : ""));
  replacePlaceholder(sentence, "WHAT", literalOfWhat(picks.what));
  qualityList.children.push(makeWhoQuality());
  replacePlaceholder(sentence, "WHO", literalOfWho(picks.who));
  return formatSentence(sentence);
}
function sleepVerb(type) {
  if (type === void 0)
    return "";
  switch (type) {
    case "nap":
      return "Napping";
    case "resting":
      return "Lying down and resting";
    case "long_sleep":
      return "Sleeping a full night";
  }
}
function tempAdj(temp) {
  if (temp === void 0)
    return "";
  switch (temp) {
    case "hot":
      return "overheated";
    case "cold":
      return "frigid";
    case "warm":
      return "warm";
  }
}

// competition/index.ts
var NUM_RANDOM_ID_CHARS = 3;
function generate_new_competition(nth_competition) {
  const num_axes = Math.floor(Math.log(nth_competition / Math.E + Math.E) + 1);
  const axes2 = random_axes(num_axes);
  const a = random_with_axes(axes2);
  const b = random_with_axes(axes2);
  const competition_id = Date.now().toString(36) + randDigt(NUM_RANDOM_ID_CHARS);
  return {
    a: {
      text: phrase(a),
      id: a.id
    },
    b: {
      text: phrase(b),
      id: b.id
    },
    id: competition_id
  };
}
function randDigt(num) {
  let r = "";
  for (var i = 0; i < num; i++)
    r += Math.floor(Math.random() * 36).toString(36);
  return r;
}

// functions/get-contest.ts
exports.handler = function(event, context, callback) {
  let nth = +event.queryStringParameters.iter;
  if (isNaN(nth))
    nth = 0;
  const contest = generate_new_competition(nth);
  callback(null, {
    statusCode: 200,
    body: JSON.stringify(contest),
    headers: {
      "Content-Type": "application/json"
    }
  });
};
