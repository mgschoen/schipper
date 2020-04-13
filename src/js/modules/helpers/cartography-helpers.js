import lineArc from '@turf/line-arc';

export function translateWithBearing (originX, originY, distance, bearing) {
    let arc = lineArc([originX, originY], distance, 0, bearing);
    let coords = arc.geometry.coordinates;
    return coords.pop();
}
