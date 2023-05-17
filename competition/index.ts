import { AxisPoint, axis_name, point_from_id, random_axes, random_with_axes } from "./axes";
import { dims_from_id, dims_to_id, point_id, random_different_id } from "./axes/id";
import { phrase } from "./phraser";
type PublicCompetition = {
    a: {
        text: string,
        id: number
    }
    b: {
        text: string,
        id: number
    },
    id: string
}

// console.log(phrase({
//     dimensions: [
//         { axis: "light", "value": "dark" },
//         { axis: "where", value: "outside" }
//     ],
//     id: 0 as point_id
// }, false))

export const NUM_RANDOM_ID_CHARS = 3;

export function generate_new_competition(nth_competition: number): PublicCompetition {
    const num_axes_max = Math.floor(Math.log(Math.E * (nth_competition + 1)));
    const num_axes = Math.max(1, Math.floor(num_axes_max * Math.sqrt(Math.random())));
    
    const a = random_with_axes(random_axes(num_axes));
    let b = random_with_axes(random_axes(num_axes));

    while(a.id == b.id) {
        b = point_from_id(random_different_id(a.id));
    }

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
    }
}

function randDigt(num: number) {
    let r = "";
    for(var i = 0; i < num; i++) r += Math.floor(Math.random() * 36).toString(36);
    return r;
}
