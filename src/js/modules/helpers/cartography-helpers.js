import lineArc from '@turf/line-arc';

function toRad (degree) {
    return degree * (Math.PI / 180);
}

function translateWithBearing (originX, originY, distance, bearing) {
    let arc = lineArc([originX, originY], distance, 0, bearing);
    let coords = arc.geometry.coordinates;
    return coords.pop();
}

export default {
    toRad,
    translateWithBearing
}
