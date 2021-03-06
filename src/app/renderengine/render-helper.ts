/*
 * Project Ariana
 * render-helper.ts
 *
 * This file contains some common helper function for webgl.
 *
 */

/// <reference path="shaders"/>

/* This function compiles a shader program out of a vertex and a fragment shader.
 *
 * On error an alert will be shown.
 */
function compileProgram(gl : WebGLRenderingContext, vertexShader : WebGLShader, fragmentShader : WebGLShader) : WebGLProgram{
	/* Create the shader program */
	var shaderProgram : WebGLProgram = gl.createProgram();

	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);

	gl.linkProgram(shaderProgram);
	
	/* If creating the shader program failed, alert */
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Unable to initialize the shader program.");
	}
	
	return shaderProgram;
}

/* This function compiles a given shader. On client side, the shader source code is aggregated into one
 * object by the grunt built system.
 */
function compileShaderFromScript(gl : WebGLRenderingContext, id : string) : WebGLShader {
    if (! (id in SHADERS)) {
        return null;
    }

    var shaderScript = SHADERS[id];

	if (shaderScript.type == "x-shader/x-fragment") {
		return compileShader(gl, shaderScript.source, gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		return compileShader(gl, shaderScript.source, gl.VERTEX_SHADER);
	} else {
		return null;
	}	
}

function compileShader(gl : WebGLRenderingContext, shaderSource : string, shaderType : number) : WebGLShader {
	var shader = gl.createShader(shaderType);
	gl.shaderSource(shader, shaderSource);
		
	/* Compile the shader program */
	gl.compileShader(shader);  
		
	/* See if it compiled successfully */
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
			alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
			return null;
	}
	return shader;
}