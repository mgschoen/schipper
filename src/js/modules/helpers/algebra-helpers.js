function toRad (degree) {
    return degree * (Math.PI / 180);
}

function rotateVector (x, y, degree) {
    let rotation = -toRad(degree);
    let rotatedX = (x * Math.cos(rotation)) - (y * Math.sin(rotation));
    let rotatedY = (x * Math.sin(rotation)) + (y * Math.cos(rotation));
    return [rotatedX, rotatedY];
}

export default {
    toRad,
    rotateVector
}
