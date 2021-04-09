const mat4 = glMatrix.mat4;
const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying lowp vec4 vColor;
        void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
        }`;

const fsSource = `
        varying lowp vec4 vColor;

        void main(void) {
          gl_FragColor = vColor;
        }`;

class DemoScene extends Scene {
    constructor() {
        super("demoScene");
    }

    init(engine) {
        this.cubePos = [0.0, 0.0, -6.0];
        this.cubeRotation = 0.0;
        this.shaderProgram = shader(engine.gl)
            .vertex(vsSource)
            .fragment(fsSource)
            .build();

        this.programInfo = this.initProgramInfo(engine.gl, this.shaderProgram);
        this.buffers = this.initBuffers(engine.gl, this.programInfo);

        var scene = this;
        engine.canvas.addEventListener("click", (event) => {
            var pos = getNoPaddingNoBorderCanvasRelativeMousePosition(event, engine.gl.canvas);
            console.log(pos);
        });
    }

    update(engine, deltaTime) {
        this.cubeRotation += deltaTime;
    }

    render(engine, deltaTime) {
        resizeCanvasToDisplaySize(engine.canvas, window.devicePixelRatio, function() {
            engine.gl.viewport(0, 0, engine.gl.canvas.width, engine.gl.canvas.height);
        });
        this.drawScene(engine.gl, this.programInfo, this.buffers, deltaTime);
    }

    initProgramInfo(gl, shaderProgram) {
        return {
            program: shaderProgram.glId,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram.glId, 'aVertexPosition'),
                vertexColor: gl.getAttribLocation(shaderProgram.glId, 'aVertexColor'),
            },
            uniformLocations: {
                projectionMatrix: gl.getUniformLocation(shaderProgram.glId, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(shaderProgram.glId, 'uModelViewMatrix'),
            },
        };
    }

    initBuffers(gl, programInfo) {
        const vertexCount = 36;

        const positions = [
            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
        ];

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
        }

        const faceColors = [
            [1.0, 1.0, 1.0, 1.0],    // Front face: white
            [1.0, 0.0, 0.0, 1.0],    // Back face: red
            [0.0, 1.0, 0.0, 1.0],    // Top face: green
            [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
            [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
            [1.0, 0.0, 1.0, 1.0],    // Left face: purple
        ];

        // Since each face contains 4 vertices, repeat the colors four times (one per vertex)
        var colors = [];
        for (var j = 0; j < faceColors.length; ++j) {
            const color = faceColors[j];
            colors = colors.concat(color, color, color, color);
        }

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        {
            const numComponents = 4;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
        }

        const indices = [
             0,  1,  2,  0,  2,  3,   // front
             4,  5,  6,  4,  6,  7,   // back
             8,  9, 10,  8, 10, 11,   // top
            12, 13, 14, 12, 14, 15,   // bottom
            16, 17, 18, 16, 18, 19,   // right
            20, 21, 22, 20, 22, 23,   // left
        ];

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices), gl.STATIC_DRAW);

        return {
            position: positionBuffer,
            color: colorBuffer,
            indices: indexBuffer,
            vertexCount: vertexCount
        };
    }

    drawScene(gl, programInfo, buffers, deltaTime) {
        gl.clearColor(0.0, 0.75, 1.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const fov = 70;
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.01;
        const zFar = 1000.0;
        const projectionMatrix = mat4.create();

        mat4.perspective(projectionMatrix,
            fov * Math.PI / 180,
            aspect,
            zNear,
            zFar);

        const modelViewMatrix = mat4.create();

        // Translate -6 in the Z so we can view and rotate based on cubeRotation which updates per frame
        mat4.translate(modelViewMatrix,
            modelViewMatrix,
            this.cubePos);
        mat4.rotate(modelViewMatrix,
            modelViewMatrix,
            this.cubeRotation,
            [0, 0, 1]);
        mat4.rotate(modelViewMatrix,
            modelViewMatrix,
            this.cubeRotation * .7,
            [0, 1, 0]);

        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

        gl.useProgram(programInfo.program);

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

        {
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, buffers.vertexCount, type, offset);
        }
    }
}