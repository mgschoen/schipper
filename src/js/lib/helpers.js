import lineArc from '@turf/line-arc';

/* cartography */
export function translateWithBearing (originX, originY, distance, bearing) {
    let arc = lineArc([originX, originY], distance, 0, bearing);
    let coords = arc.geometry.coordinates;
    return coords.pop();
}

/* CSS transforms */
function serializeTransformStyles (styleObject) {
    let serializedString = '';
    for (let style in styleObject) {
        serializedString += `${style}(${styleObject[style]}) `;
    }
    return serializedString;
}

export function getTransformStyles (element) {
    if (typeof element !== 'object') {
        return;
    }
    let transformString = element.style.transform;
    if (!transformString.length) {
        return {};
    }
    let transformDeclarations = transformString.match(/\w+\([\d\w\.]+\)/g);
    let transformations = {};
    transformDeclarations.forEach(function (declaration) {
        let parts = declaration.split(/[\(\)]/g);
        transformations[parts[0]] = parts[1];
    });
    return transformations;
}

export function setTransformStyles (element, styleObject) {
    if (typeof element !== 'object') {
        return;
    }
    let styles = getTransformStyles(element);
    if (!styles) {
        return;
    }
    for (let style in styleObject) {
        styles[style] = styleObject[style];
    }
    let serializedStyles = serializeTransformStyles(styles);
    element.style.transform = serializedStyles;
}
