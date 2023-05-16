import { randomFrom, shuffle, randomIndex, bitsRequired, selBits } from "../phraser/util";

const axes = {
    "axes": {
        "where_sleeping": [
            "dorm", "library", "outside", "camping", "car", "house"
        ],
        "what_sleeping_on": [
            "bed", "grass", "dog_bed", "rug", "couch", "hardwood", "pavement", "chair"
        ],
        "who_sleeping_with": [
            "friend", "romantic_partner", "family_member", "animal", "stuffed_animal", "someone"
        ],
        "temperature": [
            "hot", "warm", "cold"
        ],
        "sleep_type": [
            "nap", "resting", "long_sleep"
        ]
    }
} as const

export type axis_shortname = "where" | "what" | "who" | "how_who" | "temp" | "type";


const shortnames: Record<keyof typeof axes.axes, axis_shortname> = {
    where_sleeping: "where",
    what_sleeping_on: "what",
    who_sleeping_with: "who",
    temperature: "temp",
    sleep_type: "type"
} as const

export function random_axes(num: number): (keyof typeof axes.axes)[] {
    return shuffle(Object.keys(axes.axes) as (keyof typeof axes.axes)[]).slice(0, num);
}

export type AxisPoint = {
    dimensions: { axis: axis_shortname, value: string }[],
    id: number
}

export function point_from_id(id: number): AxisPoint {
    const index_where = selBits(id, axis_bit_points.where_sleeping);
    const index_what = selBits(id, axis_bit_points.what_sleeping_on, axis_bit_points.where_sleeping);
    const index_who = selBits(id, axis_bit_points.who_sleeping_with, axis_bit_points.what_sleeping_on);
    const index_temp = selBits(id, axis_bit_points.temperature, axis_bit_points.who_sleeping_with);
    const index_type = selBits(id, axis_bit_points.sleep_type, axis_bit_points.temperature);

    const axis_point: { axis: axis_shortname, value: string }[] = [];

    if(index_where != 0) axis_point.push({ axis: shortnames.where_sleeping, value: axes.axes.where_sleeping[index_where - 1] });
    if(index_what != 0) axis_point.push({ axis: shortnames.what_sleeping_on, value: axes.axes.what_sleeping_on[index_what - 1] });
    if(index_who != 0) axis_point.push({ axis: shortnames.who_sleeping_with, value: axes.axes.who_sleeping_with[index_who - 1] });
    if(index_temp != 0) axis_point.push({ axis: shortnames.temperature, value: axes.axes.temperature[index_temp - 1] });
    if(index_type != 0) axis_point.push({ axis: shortnames.sleep_type, value: axes.axes.sleep_type[index_type - 1] });

    return {
        dimensions: axis_point,
        id: id
    }
}

const axis_bit_points: Record<keyof typeof axes.axes, number> = {
    where_sleeping: bitsRequired(axes.axes.what_sleeping_on) + bitsRequired(axes.axes.who_sleeping_with)
        + bitsRequired(axes.axes.temperature) + bitsRequired(axes.axes.sleep_type) + 4,
    what_sleeping_on: bitsRequired(axes.axes.who_sleeping_with)
        + bitsRequired(axes.axes.temperature) + bitsRequired(axes.axes.sleep_type) + 3,
    who_sleeping_with: bitsRequired(axes.axes.temperature) + bitsRequired(axes.axes.sleep_type) + 2,
    temperature: bitsRequired(axes.axes.sleep_type) + 1,
    sleep_type: 0
} as const

export function random_with_axes(specific_axes: (keyof typeof axes.axes)[]): AxisPoint {
    let id = 0;

    const axis_point = specific_axes.map(x => {
        const values = axes.axes[x];
        const index = randomIndex(values);

        id |= ((index + 1) << axis_bit_points[x]);

        return {
            axis: shortnames[x],
            value: axes.axes[x][index]
        }
    });

    return {
        dimensions: axis_point,
        id: id
    };
}

export type where_opt = typeof axes.axes.where_sleeping[number];
export type what_opt = typeof axes.axes.what_sleeping_on[number];
export type who_opt = typeof axes.axes.who_sleeping_with[number];
export type temp_opt = typeof axes.axes.temperature[number];
export type sleep_opt = typeof axes.axes.sleep_type[number];

export default axes;