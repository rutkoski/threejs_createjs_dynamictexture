
/**
 *
 * app
 * 
 */

var lib = lib || {};

/**
 * 
 */



/**
 *
 * main
 * 
 */

var options = {
    camera: {
        far: 10000
    }
};

var app = new WebGLApp(options);

app.addEventListener('ready', function(event) {
    init();
});

var dynamicTexture, tennisTexture, stage;

function createApp() {
    dynamicTexture  = new THREEx.DynamicTexture(512, 512);

    var geometry = new THREE.BoxGeometry(200, 200, 200);
    var material = new THREE.MeshBasicMaterial({
        map: dynamicTexture.texture
    });

    tennisTexture = new lib.TennisTexture();
    
    stage = new createjs.Stage(dynamicTexture.canvas);
    stage.addChild(tennisTexture);
    stage.update();

    createjs.Ticker.setFPS(lib.properties.fps);
    createjs.Ticker.addEventListener("tick", stage);
    createjs.Ticker.addEventListener("tick", function() {
        dynamicTexture.texture.needsUpdate  = true;
    });

    dynamicTexture.texture.needsUpdate  = true;



    mesh = new THREE.Mesh( geometry, material );
    app.scene.add( mesh );
}

function init() {
    //
    createApp();

    app.camera.position.z = 400;

    app.attach(document.body);
    app.start();
};

document.addEventListener("DOMContentLoaded", function(event) {
    app.init();
});
