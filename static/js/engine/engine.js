class Engine {
    constructor(glCanvasName) {
        this.canvas = document.querySelector(glCanvasName);
        // Initialize the GL context
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    }

    run() {
        // Only continue if WebGL is available and working
        if (!this.gl) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
            return;
        }
        if (!this.scene) {
            alert("A scene must be set before running the engine!");
            return;
        }
        this.runScene(this.gl, this.scene);
    }

    runScene(gl, scene) {
        const engine = this;

        scene.init(engine);

        var then = 0;

        // Render loop
        function render(now) {
          now *= 0.001;  // convert to seconds
          const deltaTime = now - then;
          then = now;

          scene.update(engine, deltaTime);
          scene.render(engine, deltaTime);

          requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }

    setScene(scene) {
        this.scene = scene;
    }

}