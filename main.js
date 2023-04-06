const canvas = document.getElementById('canvas'),
      ctx = canvas.getContext('2d');

canvas.width = config.SCREEN_WIDTH;
canvas.height = config.SCREEN_HEIGHT;

let buffer = new ImageData(config.SCREEN_WIDTH, config.SCREEN_HEIGHT);

for (var j = 0; j < config.SCREEN_HEIGHT; j++) {
    for (var i = 0; i < config.SCREEN_WIDTH; i++) {
        // draw void (solid gray)
        setPixel(i, j, [128, 128, 128], buffer);
    }
}

let model = new StaticMesh("./data/meshes/plane.obj");

setTimeout(() => {

    for (const face of model.faces) {
        let sspace = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
            let vertex = model.vertices[face[i] - 1];
            sspace[i] = [
                parseInt(
                    (vertex[0] / (vertex[1] - 1.25)) 
                    * config.SCREEN_WIDTH * 0.25 
                    + config.SCREEN_WIDTH * 0.5), 
                parseInt(
                    (vertex[2] / (vertex[1] - 1.25)) 
                    * config.SCREEN_HEIGHT * 0.25 
                    + config.SCREEN_HEIGHT * 0.5),
                vertex[1]
            ];
        }
        drawTriangle(
            sspace[0], 
            sspace[1], 
            sspace[2], 
            [Math.random() * 256, Math.random() * 256, Math.random() * 256], 
            buffer
        );
    }

    ctx.putImageData(buffer, 0, 0);
}, 3000)

