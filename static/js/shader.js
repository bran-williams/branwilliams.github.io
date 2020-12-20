export function shader(gl) {
    return new ShaderBuilder(gl);
}
export class ShaderBuilder {

    #vertexShader = "";
    #fragmentShader = "";
    #gl = null;

    constructor(gl) {
        this.#gl = gl;
    }

    vertex(vertexShader) {
        this.#vertexShader = vertexShader;
        return this;
    }

    fragment(fragmentShader) {
        this.#fragmentShader = fragmentShader;
        return this;
    }

    build() {
        if (this.#vertexShader !== "" && this.#fragmentShader !== "") {
            const shaderProgram = initShaderProgram(this.#gl, this.#vertexShader, this.#fragmentShader);
            return new ShaderProgram(shaderProgram);
        } else {
            throw "";
        }
    }
}

export class ShaderProgram {
    static NO_GL_ID = -1;

    #glId = ShaderProgram.NO_GL_ID;

    constructor(glId) {
        this.#glId = glId;
    }

    get glId() {
        return this.#glId;
    }

    get exists() {
        return this.#glId !== ShaderProgram.NO_GL_ID;
    }

    destroy(gl) {
        if (this.exists) {
            gl.deleteShader(this.#glId);
            this.#glId = ShaderProgram.NO_GL_ID;
        }
    }
}


//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}


