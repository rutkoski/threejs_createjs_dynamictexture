var lib = lib || {};

var WebGLApp = function(options) {
    this.lastTimeMsec = 0;
    this.updateFcts = [];

    this.options = extend({
        camera: {
            fov: 60,
            near: 0.1,
            far: 1000
        }
    }, options || {});

    this.renderer;
    this.scene;
    this.camera;
    this.controls;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
};

//THREE.EventDispatcher.prototype.apply( THREE.Object3D.prototype );
THREE.EventDispatcher.prototype.apply( WebGLApp.prototype );

WebGLApp.prototype.constructor = WebGLApp;

WebGLApp.prototype.init = function() {
    // Setup three.js WebGL renderer. Note: Antialiasing is a big performance hit.
    // Only enable it if you actually need to.
    this.renderer = new THREE.WebGLRenderer({
        antialias: true
    });
 
    //this.renderer.shadowMap.enabled = true;
    //this.renderer.shadowMapType = THREE.PCFSoftShadowMap;

    //this.renderer.setClearColor( 0xffffff );

    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.renderer.autoClear = true;

    // Create a three.js scene.
    this.scene = new THREE.Scene();

    // Create a three.js camera.
    this.camera = new THREE.PerspectiveCamera(this.options.camera.fov, this.width / this.height, this.options.camera.near, this.options.camera.far);

    this.controls = new THREE.OrbitControls(this.camera);

    this.scene.add(this.camera);

    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    this.onWindowResize();

    this.dispatchEvent({ type: 'init' });

    this.loadAssets();
};

WebGLApp.prototype.attach = function(element) {
    element.appendChild(this.renderer.domElement);
};

WebGLApp.prototype.start = function() {
    this.animate(performance ? performance.now() : Date.now());
};

WebGLApp.prototype.animate = function(nowMsec) {

    this.controls.update();

    // Required to stop ghosting - must be placed before render update
    this.camera.updateMatrixWorld();

    this.lastTimeMsec = this.lastTimeMsec || nowMsec - 1000 / 60;
    var deltaMsec = Math.min(200, nowMsec - this.lastTimeMsec);
    this.lastTimeMsec = nowMsec;

    this.dispatchEvent({ type: 'update', delta: deltaMsec / 1000, now: nowMsec / 1000 });

    // Render the scene through the manager.
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.animate.bind(this));
};

WebGLApp.prototype.onWindowResize = function() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);

    this.dispatchEvent({ type: 'resize' });
};

WebGLApp.prototype.loadAssets = function(complete) {
    var self = this,
        t = c = manifest.length;

    if (!c) {
        self.dispatchEvent({ type: 'ready' });
    } else {
        for (var i = 0; i < c; i++) {
            var item = manifest[i];
            var ext = item.file.substr(-3);
            var loader;

            switch (ext) {
                case 'png':
                case 'jpg':
                    loader = new THREE.TextureLoader();
                    loader.load(item.file, onLoad.bind(item));
                    break;

                case 'dae':
                    loader = new THREE.ColladaLoader();
                    loader.load(item.file, onLoad.bind(item));
                    break;

                case 'svg':
                    loader = new THREE.SVGLoader();
                    loader.load(item.file, onLoad.bind(item));
                    break;
            }
        }
    }

    function onLoad(object) {
        lib[this.id] = object;
        t--;
        if (!t) {
            self.dispatchEvent({ type: 'ready' });
        }
    }
};
