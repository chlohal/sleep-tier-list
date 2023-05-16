export function shuffle<T>(aOriginal: readonly T[]): T[] {
    const a = aOriginal.slice() as T[];

    for(let i = a.length; i --> 1;) {
        const j = Math.round(Math.random() * i);

        const temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }

    return a;
}

export function randomIndex(a: readonly unknown[]): number {
    return Math.floor(Math.random() * a.length);
}

export function randomFrom<T>(a: readonly T[]): T {
    return a[randomIndex(a)];
}

export function bitsRequired<T>(a: readonly unknown[]): number {
    return Math.ceil(Math.log2(a.length));
}

export function selBits(num: number, from: number, to?: number) {
    if(to === undefined) to = from + 32;

    let size = to - from;
    let bitmask = Math.pow(2, size) - 1;

    return (num >>> from) & bitmask;
}