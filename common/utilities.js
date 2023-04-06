function setPixel(x, y, color, buf) {
    buf.data[y * (buf.width * 4) + (x * 4)] = color[0];
    buf.data[y * (buf.width * 4) + (x * 4) + 1] = color[1];
    buf.data[y * (buf.width * 4) + (x * 4) + 2] = color[2];
    buf.data[y * (buf.width * 4) + (x * 4) + 3] = 255;
}

// https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
function bresenham(x0, y0, x1, y1, color, buf) {
    let dx = Math.abs(x1 - x0);
    let sx = x0 < x1 ? 1 : -1;
    let dy = -Math.abs(y1 - y0);
    let sy = y0 < y1 ? 1 : -1;
    let error = dx + dy;

    while (true) {
        setPixel(x0, y0, color, buf);
        if (x0 == x1 && y0 == y1) break;
        let e2 = 2 * error;
        if (e2 >= dy) {
            if (x0 == x1) break;
            error += dy;
            x0 += sx;
        }
        if (e2 <= dx) {
            if (y0 == y1) break;
            error += dx;
            y0 += sy;
        }
    }
}

// https://erkaman.github.io/posts/fast_triangle_rasterization.html
// for edgeFunction and drawTriangle

function edgeFunction(/*Vector2*/ a, /*Vector2*/ b, /*Vector2*/ c) {
    return (c[0] - a[0]) * (a[1] - b[1]) + (c[1] - a[1]) * (b[0] - a[0]);
}

function drawTriangle(/*Vector2*/ v0, /*Vector2*/ v1, /*Vector2*/ v2, color, buf) {
    let amin = [-Infinity, Infinity];
    let amax = [-Infinity, Infinity];
    let vectors = [v0, v1, v2];
    let sw = config.SCREEN_WIDTH;
    let sh = config.SCREEN_HEIGHT;

    for (const v of vectors) {
        amin[0] = Math.max(0, Math.min(amin[0], v[0]));
	    amin[1] = Math.max(0, Math.min(amin[1], v[1]));

	    amax[0] = Math.min(sw - 1, Math.max(amax[0], v[0]));
	    amax[1] = Math.min(sh - 1, Math.max(amax[1], v[1]));
    }


    let p = [0, 0, 0];
    for (p[0] = amin[0]; p[0] <= amax[0]; p[0]++) {
        for (p[1] = amin[1]; p[1] <= amax[1]; p[1]++) {
            let w0 = edgeFunction(v1, v2, p);
            let w1 = edgeFunction(v2, v0, p);
            let w2 = edgeFunction(v0, v1, p);

            if (w0 < 0 || w1 < 0 || w2 < 0) continue;

            setPixel(p[0], p[1], color, buf);
        }
    }
    bresenham(v2[0], v2[1], v1[0], v1[1], [0, 0, 0], buf);
    bresenham(v2[0], v2[1], v0[0], v0[1], [0, 0, 0], buf);
    bresenham(v0[0], v0[1], v1[0], v1[1], [0, 0, 0], buf);
}