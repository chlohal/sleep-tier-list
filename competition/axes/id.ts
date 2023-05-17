import { axis_dimensions, axis_name } from ".";
import { randomFrom, shuffle } from "../phraser/util";
import { axes } from "./axis-data";

declare const u: unique symbol;
type Opaque<T> = T & { readonly [u]: never };
export type point_id = Opaque<number> 

const axis_bit_points: Record<axis_name, number> = {
    where: bit_points_of("where"),
    what: bit_points_of("what"),
    who: bit_points_of("who"),
    temp: bit_points_of("temp"),
    noise: bit_points_of("noise"),
    light: bit_points_of("light"),
    type: bit_points_of("type")
} as const;

export function random_different_id(id: point_id): point_id {
    const dims = dims_from_id(id);

    const dim = randomFrom(dims);

    const options = shuffle(axes[dim.axis]);

    if(options[0] == dim.value) dim.value = options[1];
    else dim.value = options[0];

    return dims_to_id(dims);
}

export function dims_from_id(id: point_id): axis_dimensions {
    const axis_point: axis_dimensions = [];


    for(const axis of Object.keys(axes) as (keyof typeof axes)[]) {
        const index_of_axis = Math.floor(id / axis_bit_points[axis]) % (axes[axis].length + 1);

        if(index_of_axis != 0) axis_point.push({ axis: axis, value: axes[axis][index_of_axis - 1] } as any);
    }

    return axis_point;
}

export function dims_to_id(dimensions: axis_dimensions): point_id {
    let id = 0;

    for(const dim of dimensions) {
        id += axis_bit_points[dim.axis] * ((axes[dim.axis] as readonly string[]).indexOf(dim.value) + 1);
    }

    return id as point_id;
}

function bit_points_of(axis: axis_name): number {
    const order = ["where", "what", "who", "temp", "noise", "light", "type"] as const;

    let result = 1;

    for(let i = order.indexOf(axis) + 1; i < order.length; i++) {
        result *= (axes[order[i]].length + 1);
    }

    return result;
}