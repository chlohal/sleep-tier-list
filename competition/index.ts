import { AxisPoint, point_from_id, random_axes, random_with_axes } from "./axes";
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
    const num_axes = Math.floor(Math.log((nth_competition / Math.E) + Math.E) + 1);
    const axes = random_axes(num_axes);
    
    const a = random_with_axes(axes);
    let b: typeof a;

    do {
        b = random_with_axes(axes);
    } while(a.id == b.id);

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
