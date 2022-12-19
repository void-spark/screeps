exports.forSquare = (xCenter, yCenter, steps, spacing, callback) => {
    const increase = spacing + 1;
    const outer = steps * increase;

    for (let x = -outer; x <= outer; x += increase) {
        const xOnEdge = x == -outer || x == outer;
        for (let y = -outer; y <= outer; y += increase) {
            const yOnEdge = y == -outer || y == outer;
            if (xOnEdge || yOnEdge) {
                if (callback(xCenter + x, yCenter + y)) {
                    return true;
                }
            }
        }
    }
    return false;
}

exports.canBuild = (room, x, y) => {
    const look = room.lookAt(x, y);
    var ok = true;
    look.forEach(obj => {
        if (obj.type == LOOK_TERRAIN && obj[LOOK_TERRAIN] == 'wall') {
            ok = false;
        } else if (obj.type == LOOK_STRUCTURES) {
            ok = false;
        }
    });
    return ok;
}

exports.notBlocked = (room, x, y) => {
    const look = room.lookAt(x, y);
    var ok = true;
    look.forEach(obj => {
        if (obj.type == LOOK_TERRAIN && obj[LOOK_TERRAIN] == 'wall') {
            ok = false;
        } else if (obj.type == LOOK_STRUCTURES) {
            ok = false;
        }
    });
    return ok;
}