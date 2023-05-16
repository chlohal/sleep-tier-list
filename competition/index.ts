import { random_axes, random_pair_with_axes } from "./axes";
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

export const NUM_RANDOM_ID_CHARS = 3;

export function generate_new_competition(nth_competition: number): PublicCompetition {
    const num_axes_max = Math.floor(Math.log(Math.E * (nth_competition + 1)));
    const num_axes = Math.max(1, Math.floor(num_axes_max * Math.sqrt(Math.random())));

    const axes = random_axes(num_axes);
    
    const [a, b] = random_pair_with_axes(axes);

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
