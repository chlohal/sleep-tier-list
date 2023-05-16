import { point_from_id, random_axes, random_with_axes } from "./axes";
import { phrase } from "../phraser";

for(let i = 0; i < 10_000_000; i++) {
    const axes = random_axes(87);

    const a = random_with_axes(axes);
    const b = random_with_axes(axes);

    console.log(`${phrase(a)} vs ${phrase(b)}`);
}