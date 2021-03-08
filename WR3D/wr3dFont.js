/****************************************************
*	11/09/2019
*	WR3D Engine WebGL2.0 
*	https://github.com/maxcccp
* 	© Max ( https://mbprogrammer.com ) 
*	For learning JavaScript and WebGL...
*****************************************************/
;

////////////////////////////////////////////////////////////////////////////////
// FONT...
WR3D.Font = {
	textCtx : null,
	// shaderTest...
	shaderFont:{
		VS:`#version 300 es
		in vec4 aPosition;
		in vec3 aColor;
		in vec2 aTexcoord;

		uniform mat4 uViewMatrix;
		uniform mat4 uModelMatrix;
		uniform mat4 uProjectionMatrix;

		out vec3 oColor;
		out vec2 oTexCoord;

		void main() {
		  // Multiply the position by the matrix.
		  gl_Position = uProjectionMatrix  * uViewMatrix *  uModelMatrix * aPosition;

		  // Pass the texcoord to the fragment shader.
		  oTexCoord = aTexcoord;
		  oColor = aColor;
		}`,

		FS:`#version 300 es
		precision mediump float;

		in vec3 oColor;
		in vec2 oTexCoord;

		out vec4 outColor;
		uniform sampler2D uTexture;

		void main() {
			
			//outColor = vec4( oColor, 1.0 );
		   	outColor = texture( uTexture, oTexCoord ); 
		   
		}`
	},
	Shader : null,
	init : function(){
		this.Shader = new WR3D.glProgram( this.shaderFont.VS, this.shaderFont.FS );
		textCtx = document.createElement( "canvas" ).getContext( "2d" );
		return this;
	}

};

// NOTE: Puts text in center of canvas.
WR3D.Font.createImgFont = function( text, width, height, color="black" ) {
	this.text 				= text;
	textCtx.canvas.width  	= width;
	textCtx.canvas.height 	= height;
	//textCtx.shadowBlur  	= 16;
	textCtx.font 			= "30px Consoles";
	textCtx.textAlign 		= "center";
	textCtx.textBaseline 	= "middle";
	textCtx.fillStyle 		= color;
	textCtx.clearRect( 0, 0, textCtx.canvas.width, textCtx.canvas.height );
	//textCtx.strokeRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
	
	textCtx.fillText( this.text, width / 2, height / 2);


	this.textTex = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.textTex);
		//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	  		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCtx.canvas);
	  	gl.generateMipmap(gl.TEXTURE_2D);
	  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  	return this;
}

// NOTE:
WR3D.Font.resetTexText = function( valTest ){

		this.text = valTest;
		textCtx.fillText( this.text, width / 2, height / 2 );
		gl.bindTexture( gl.TEXTURE_2D, this.textTex );
		//gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
	  		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCtx.canvas );
	  	gl.generateMipmap( gl.TEXTURE_2D );
	  	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
	  	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
	  	return this;
}

// NOTE:
WR3D.Font.createImgFont.prototype.DrawText = function( pos, id ){
	if( id === undefined ) id = 0;

	WR3D.Font.Shader.setUniformTexure( "uTexture", id );
	WR3D.Font.Shader.setUniformMat4( 'uModelMatrix', objMove( pos ) );
	gl.activeTexture( gl.TEXTURE0 + id );
	gl.bindTexture( gl.TEXTURE_2D, this.textTex );
	//plane3D.DrawMesh();
}




