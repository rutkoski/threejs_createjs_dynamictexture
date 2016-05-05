(function(lib, img, cjs, ss) {

    var p;

    // library properties:
    lib.properties = {
        width: 512,
        height: 512,
        fps: 24,
        color: "#FFFFFF",
        manifest: []
    };

    /**
     *
     * App
     * 
     */

    (function() {
        (lib.TennisTexture = function() {
            this.initialize();

            this.fundo = new cjs.Shape();
            this.addChild(this.fundo);

            var g = this.fundo.graphics.clear();
            g.beginFill('white').drawRect(0, 0, lib.properties.width, lib.properties.height).endFill();




            this.current = new cjs.Bitmap('assets/a.jpg');
            this.addChild(this.current);



            this.transitionTo('assets/b.jpg');

        }).prototype = p = new cjs.Container();

        p.transitionTo = function(img) {

            this.next = new cjs.Bitmap(img);
            this.addChild(this.next);

            this.masc = new cjs.Shape();
            this.masc.graphics.clear().beginFill('red').drawCircle(256, 256, 1000);

            this.next.mask = this.masc;

            cjs.Tween.get(this.masc).to({ scaleX: 0, scaleY: 0 }).to({ scaleX: 1, scaleY: 1 }, 3000).call(handleComplete.bind(this));
            
            function handleComplete() {
                this.removeChild(this.current);
                this.current = this.next;
            }

        };

    }());

})(lib = lib || {}, images = images || {}, createjs = createjs || {}, ss = ss || {});
var lib, images, createjs, ss;
