export function interpolateNumber(a, b) {
    return function (t) {
        return a + t * (b - a);
    };
}
