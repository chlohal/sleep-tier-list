import { randomFrom, shuffle, randomIndex, bitsRequired, selBits } from "../phraser/util";
import { axes } from "./axis-data";
import { dims_from_id, dims_to_id, point_id } from "./id";

export type opt<T extends axis_name> = typeof axes[T][number];

export type dimension_record<T extends axis_name> = { axis: T, value: opt<T> };
export type axis_dimensions = ({[K in axis_name]: dimension_record<K>}[axis_name])[];

export type axis_name = keyof typeof axes;


export function random_axes(num: number): axis_name[] {
    return shuffle(Object.keys(axes) as (keyof typeof axes)[]).slice(0, num);
}

export type AxisPoint = {
    dimensions: axis_dimensions
    id: point_id
}


export function point_from_id(id: point_id): AxisPoint {
    return {
        dimensions: dims_from_id(id),
        id
    }
}


export function random_with_axes(specific_axes: axis_name[]): AxisPoint {
    const dimensions: axis_dimensions = [];

    for(const axis of specific_axes) {
        const values = axes[axis];
        const index = Math.floor(Math.random() * values.length);

        dimensions.push({
            axis: axis,
            value: values[index]
        } as any);
    };

    return {
        dimensions, id: dims_to_id(dimensions)
    };
}
export default axes;