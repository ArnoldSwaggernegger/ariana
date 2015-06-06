/**
 * Created by zeta on 6/2/15.
 */
/// <reference path="render-helper"/>
/// <reference path="layer"/>
/// <reference path="drawbuffer"/>
/// <reference path="filter"/>
/// <reference path="image-layer"/>

class RenderEngine {
    gl : WebGLRenderingContext;

    /* Array of layers in the order that the user sees them */
    layers : Array<Layer>;
    drawbuffer1 : DrawBuffer;
    drawbuffer2 : DrawBuffer;

    /* Width and height of the framebuffer */
    width : number;
    height : number;

    constructor (canvas : HTMLCanvasElement) {
        this.width = canvas.width;
        this.height = canvas.height;

        this.layers = new Array();

        try {
            /* Try to grab the standard context. If it fails, fallback to experimental. */
            //this.gl = <WebGLRenderingContext> (canvas.getContext("webgl", {stencil:true}) || canvas.getContext("experimental-webgl", {stencil:true}));
            this.gl = <WebGLRenderingContext> (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
            /*var contextAttributes = this.gl.getContextAttributes();
            var haveStencilBuffer = contextAttributes.stencil;

            if (!haveStencilBuffer) {
                console.log("Your browser has limited support for WebGL (missing stencil buffer).\nSelection will not work!");
            }*/

            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        }
        catch(e) {
            alert("Your device/browser doesnt support WebGL!\ncheck console for stacktrace.");
            console.log(e.stack);
        }

        this.drawbuffer1 = new DrawBuffer(this.gl, this.width, this.height);
        this.drawbuffer2 = new DrawBuffer(this.gl, this.width, this.height);
    }

    addLayer(layer : Layer) {
        /* Append layer to user array */
        this.layers.push(layer);
    }
 
    removeLayer(index : number) {
        var layer : Layer = this.layers[index];
        this.layers.splice(layer.ID, 1);
        layer.destroy();
    }

    reorder(i : number, j : number) {
        /* Switch places in the user array */
        var temp = this.layers[i];
        this.layers[i] = this.layers[j];
        this.layers[j] = temp;
    }

    render() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);// | this.gl.STENCIL_BUFFER_BIT);

        var oldType = -1;
        var numItems = this.layers.length;

        /* Draw all layers to the currently bound framebuffer */
        for (var i = 0; i < numItems; i++) {
            var layer = this.layers[i];
            if (layer.layerType != oldType) {
                /*
                 * We're drawing a different type of layer then our previous one,
                 * so we need to do some extra stuff.
                 */
                layer.setupRender();
                oldType = layer.layerType;
            }

            layer.render();
        }
    }

    filterLayers(layerIndices : number[], filter : Filter) {
        for (var i = 0; i < layerIndices.length; i ++) {
            var layer = this.layers[layerIndices[i]];
            if (layer.layerType !== LayerType.ImageLayer) {
                continue;
            }

            var imageLayer = <ImageLayer> layer;
            this.drawbuffer1.bind();
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);// | this.gl.STENCIL_BUFFER_BIT);
            imageLayer.setupRender();
            imageLayer.render();
            this.drawbuffer1.unbind();

            this.drawbuffer2.bind();
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);// | this.gl.STENCIL_BUFFER_BIT);
            filter.render(this.drawbuffer1.getWebGlTexture());
            imageLayer.copyFramebuffer(this.width, this.height);
            this.drawbuffer2.unbind();

            imageLayer.setDefaults();

            // Replace layer with ImageLayer (if it was not an ImageLayer) or set the texture of ImageLayer to buffer2.getWebGLTexture();
        }
        this.drawbuffer2.unbind();
    }

    renderToImg() {
        /* Render all layers to a framebuffer and return a 64base encoded image */
        this.drawbuffer1.bind();
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);// | this.gl.STENCIL_BUFFER_BIT);
        this.render();
        var val = this.drawbuffer1.getImage();
        this.drawbuffer1.unbind();

        return val;
    }

    getWebGLRenderingContext() : WebGLRenderingContext {
        return this.gl;
    }

    destroy() {
        for (var i = 0; i < this.layers.length; i++) {
            this.layers[i].destroy();
        }

        this.drawbuffer1.destroy();
        this.drawbuffer2.destroy();
    }
}