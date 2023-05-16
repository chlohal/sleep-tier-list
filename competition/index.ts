import { AxisPoint, point_from_id, random_axes, random_with_axes } from "./axes";
import { phrase } from "./phraser";
type Competition = {
    competitor_a: AxisPoint,
    competitor_b: AxisPoint,
    id: string
}

type PublicCompetition = {
    a: string,
    b: string,
    id: string
}

export function record_competition_results() {

}

export function generate_new_competition(nth_competition: number): PublicCompetition {
    const num_axes = Math.floor(Math.log((nth_competition / Math.E) + Math.E) + 1);
    const axes = random_axes(num_axes);
    
    const a = random_with_axes(axes);
    const b = random_with_axes(axes);

    return {
        a: phrase(a),
        b: phrase(b),
        id: a.id.toString(16) + ":" + b.id.toString(16)
    }
}