/****************************************************
*	11/09/2019
*	WR3D Engine WebGL2.0 
*	https://github.com/maxcccp
* 	© Max ( https://mbprogrammer.com ) 
*	For learning JavaScript and WebGL...
*****************************************************/
; 




var gl;

var TRUE = 1, FALSE = 0;
var DEBUG_ENGINE = TRUE;

// ENUM VARIABLED OPENGL-ES ATTRIBUTE SHADER.
var ATTR_LOCATION_POSITION		= 0,
	ATTR_LOCATION_COLOR			= 1,
    ATTR_LOCATION_UVCOORD		= 2,
    ATTR_LOCATION_NORMAL 		= 3,
    ATTR_LOCATION_TANGENT 		= 4,
    ATTR_LOCATION_ARGTANGENT 	= 5;

// ENUM TYPE TEXTURE.
var TEXTURE_1D 		= 1, 
	TEXTURE_2D 		= 2, 
	TEXTURE_3D		= 3,
	TEXTURE_CUBE 	= 6;



// note: state mouse btn.
var btnListMouse = {};
var btnLeft = 0, 
	btnWheel = 1, 
	btnRight = 2;


// Array EVENT KEY...
var btnListKeyboard = {};
var Key = {
	backspace : 8,
	tab	  : 9,
	enter : 13,
	shift : 16,
	ctrl  : 17,
	alt	  : 18,
	pauseBreak : 19,
	capsLock : 20,
	escape : 27,
	pageUp : 33,
	Space  : 32,
	pageDown : 34,
	end	 : 35,
	home : 36,
	arrowLeft  : 37,
	arrowUp	   : 38,
	arrowRight : 39,
	arrowDown  : 40,
	printScreen : 44,
	insert : 45,
	delete : 46,
	k0 : 48,
	k1 : 49,
	k2 : 50,
	k3 : 51,
	k4 : 52,
	k5 : 53,
	k6 : 54,
	k7 : 55,
	k8 : 56,
	k9 : 57,
	a :	65,
	b :	66,
	c :	67,
	d :	68,
	e :	69,
	f :	70,
	g :	71,
	h :	72,
	i :	73,
	j :	74,
	k :	75,
	l :	76,
	m :	77,
	n :	78,
	o :	79,
	p :	80,
	q :	81,
	r :	82,
	s :	83,
	t :	84,
	u :	85,
	v :	86,
	w :	87,
	x :	88,
	y :	89,
	z :	90,
	leftWinKey 	: 91,
	rightWinKey : 92,
	selectkey 	: 93,
	numpad0		: 96,
	numpad1		: 97,
	numpad2		: 98,
	numpad3		: 99,
	numpad4		: 100,
	numpad5		: 101,
	numpad6		: 102,
	numpad7		: 103,
	numpad8 	: 104,
	numpad9 	: 105,
	multiply 	: 106,
	add			: 107,
	subtract 	: 109,
	decimalPoint : 110,
	divide		: 111,
	f1	: 112,
	f2	: 113,
	f3	: 114,
	f4	: 115,
	f5	: 116,
	f6	: 117,
	f7	: 118,
	f8	: 119,
	f9	: 120,
	f10	: 121,
	f11	: 122,
	f12	: 123
};
// Array EVENT MOUSE move in region canvas.
var mouseEventHideCursorXY = { X:0.0, Y:0.0 };
// Affry EVENT MOUSE move in region all window brouser.
var mouseEventXY = { X:0.0, Y:0.0, Event:{} };





////////////////////////////////////////////////////////////////////////////////
// ALL FUNCTION
function debug( msg ){
	if( DEBUG_ENGINE ) 
		console.log( "[ DEBUG ] " + msg + " (^_^)" );
}

function cout( msg ){

 	console.log( msg );
}

function convertHex( src ){
	var resultBinary = "";
	for( var i = 0; i < src.length; i++ ){
		resultBinary += src[i].charCodeAt( 0 ).toString( 16 ) + " ";
	}
	return resultBinary;
}

function convertBin( src ){
	var resultBinary = "";
	for( var i = 0; i < src.length; i++ ){
		resultBinary += src[i].charCodeAt( 0 ).toString( 2 ) + " ";
	}
	return resultBinary;
}

function radians( degrees ){
	var pi = Math.PI;
	return degrees * ( pi / 180 );
}
  
function degrees( radians ){
	var pi = Math.PI;
	return radians * ( 180 / pi );
}

function objMove(  vec3 ){
	var matrix = mat4.create();
	mat4.translate( matrix, matrix, vec3 );
	return matrix;
}

function objRotate( angl,  vec3 , matrix ){
	// note: destination matrix, matrix to rotate, rotate in radians, axis to rotate around ( X, Y, Z ).
	if( matrix === undefined ){
		var matrix = mat4.create();
		mat4.rotate( matrix,  matrix, radians ( angl ) , vec3 );
		return matrix;
	}
	else{
		mat4.rotate( matrix,  matrix, angl, vec3 );
		return matrix;
	}
	    
	   	      
}

function setupVideo(url) {
  const video = document.createElement('video');

  var playing = false;
  var timeupdate = false;

  video.autoplay = true;
  video.muted = true;
  video.loop = true;

  // Waiting for these 2 events ensures
  // there is data in the video

  video.addEventListener('playing', function() {
     playing = true;
     checkReady();
  }, true);

  video.addEventListener('timeupdate', function() {
     timeupdate = true;
     checkReady();
  }, true);

  video.src = url;
  video.play();

  function checkReady() {
    if (playing && timeupdate) {
      copyVideo = true;
    }
  }

  return video;
}

function updateTextureVideo(texture, video) {
  const level = 0;
  const internalFormat = gl.RGBA;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                srcFormat, srcType, video);
}





////////////////////////////////////////////////////////////////////////////////
// SHADER LIBRARY
var LibShader={
	
	// note: 
	shaderBase : {
		VS : `#version 300 es
			in vec3 aVertexPosition;
			in vec3 aVertexColor;
			in vec2 a_texcoord;
			uniform mat4 uViewMatrix;
			uniform mat4 uModelViewMatrix;
			uniform mat4 uProjectionMatrix;
			
			out vec3 vColor;
			out vec2 v_texcoord;

			void main()
			{
				gl_Position = uProjectionMatrix * uViewMatrix * uModelViewMatrix * vec4(aVertexPosition,1.0);
				vColor = aVertexColor;
				v_texcoord = a_texcoord;
			}
		`,
	
		FS : `#version 300 es
			precision mediump float;
				
			in vec3 vColor;
			in vec2 v_texcoord;

			out vec4 outColor;

			uniform sampler2D u_texture;

			void main() 
			{
				//outColor = vec4(vColor, 1.0);

				outColor = texture(u_texture, v_texcoord);
				//outColor = texture(u_texture, v_texcoord)*vec4(vColor, 1.0);
			}
			`
	},

	// note:
	shaderMultTexture : {	
		VS : `#version 300 es
			in vec4 aVertexPosition;
			in vec3 aVertexColor;
			in vec2 a_texcoord;
			uniform mat4 uModelViewMatrix;
			uniform mat4 uProjectionMatrix;
			
			out vec3 vColor;
			out vec2 v_texcoord;

			void main()
			{
				gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
				vColor = aVertexColor;
				v_texcoord = a_texcoord;
			}
		`,

		
		FS : `#version 300 es
			precision mediump float;
			
			in vec3 vColor;
			in vec2 v_texcoord;

			out vec4 outColor;

			uniform sampler2D u_texture_deffuse;
			uniform sampler2D u_texture_normal;
			uniform sampler2D u_texture_spacular;

			void main() 
			{
				outColor = texture(u_texture, v_texcoord);
				//outColor = texture(u_texture, v_texcoord)*vec4(vColor, 1.0);
			}
		`
	},

	// note: shaderTest...
	shaderText:{
		VS:`#version 300 es
		in vec4 a_position;
		in vec3 a_color;
		in vec2 a_texcoord;

		uniform mat4 uViewMatrix;
		uniform mat4 uModelViewMatrix;
		uniform mat4 uProjectionMatrix;

		out vec3 v_color;
		out vec2 v_texcoord;

		void main() {
		  // Multiply the position by the matrix.
		  gl_Position = uProjectionMatrix  * uViewMatrix *  uModelViewMatrix * a_position;

		  // Pass the texcoord to the fragment shader.
		  v_texcoord = a_texcoord;
		  v_color = a_color;
		}`,

		FS:`#version 300 es
		precision mediump float;

		in vec3 v_color;
		// Passed in from the vertex shader.
		in vec2 v_texcoord;

		uniform sampler2D u_texture;

		out vec4 outColor;

		void main() {
		   outColor = texture(u_texture, v_texcoord);// * vec4(v_color,1.0);
		}`
	},

	// note: shader animation plane fase.
	glslAnimatePlane:{
		VS : `
				in vec4 a_position;	// Making it a vec4, the w component is used as color index from uColor
				in vec3 a_norm;
				in vec2 a_uv;

				uniform mat4 uPMatrix;
				uniform mat4 uMVMatrix;
				uniform mat4 uCameraMatrix;

				uniform vec3 uColor[6];
				uniform float uTime;

				out lowp vec4 color;
				out highp vec2 texCoord;  // Interpolate UV values to the fragment shader
				
				vec3 warp(vec3 p){
					//return p + 0.2 * abs(cos(uTime*0.002)) * a_norm;
					//return p + 0.5 * abs(cos(uTime*0.003 + p.y)) * a_norm;
					return p + 0.5 * abs(cos(uTime*0.003 + p.y*2.0 + p.x*2.0 + p.z)) * a_norm;
				}

				void main(void){
					texCoord = a_uv;
					color = vec4(uColor[ int(a_position.w) ],1.0);
					gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4( warp( a_position.xyz ), 1.0 ); 
				}
			`,
		FS : `
				precision mediump float;
				
				in vec4 color;
				in highp vec2 texCoord;		//What pixel to pull from the texture
				uniform sampler2D uMainTex;	//Holds the texture we loaded to the GPU
				
				out vec4 finalColor;
				void main(void){			//Confusing that UV's coords are S,T but in all honestly it works just like X,Y
					finalColor = color;
					//finalColor = texture(uMainTex,texCoord);	//Just The Texture
					//finalColor = color * texture(uMainTex,texCoord); //Mixing Texture and Color together
					//finalColor = color * texture(uMainTex,texCoord) * 1.5f; //Making the colors brighter
					//finalColor = color + texture(uMainTex,texCoord); //Mixing the color and textures with addition,Dif effect
					//finalColor = mix(color,texture(uMainTex,texCoord),0.8f); //Using mix func to fade between two pixel colors.
				}
			`
	},


	// note: Skybox.
	glslSkybox:{
		VS : `#version 300 es
			
			in vec3 aPosition;
			in vec3 aColor;
			in vec2 aTexCoord;
			
			out vec3 TexCoord0;

			uniform mat4 uViewMatrix;
			uniform mat4 uModelViewMatrix;
			uniform mat4 uProjectionMatrix;

			void main()
			{
				
				vec4 wvp = uProjectionMatrix * mat4( mat3( uViewMatrix ) ) * vec4( aPosition, 1.0 );
				gl_Position = wvp.xyww;
				TexCoord0   = aPosition; //vec3( aTexCoord.x, aTexCoord.y, 0.0 );
			}

			`,
		FS : `#version 300 es
			precision highp float;
			in vec3 TexCoord0;

			out vec4 FragColor;

			uniform samplerCube cubeTexture;
			//uniform sampler2D cubeTexture;

			void main()
			{
			    FragColor = texture( cubeTexture, vec3( TexCoord0.x, -TexCoord0.y, TexCoord0.z ) );
			    //FragColor = vec4( 1.0,1.0,0.0,1.0 );
			}

			`
	}
	



};


////////////////////////////////////////////////////////////////////////////////
// WR3D ENGINE
var WR3D = {
	canvasWidth: 0,
	canvasHeight: 0,
	aspectDifference:0,
	sceneFunction: null
	

};

WR3D.Time = {
	fps : 0.0,
	timeLast : 0,
	deltaTime : 0,
	outFps:null,
	init:function( divID ){
		outFps = document.getElementById( divID );
	},
	FPS : function (){	
		var timeNow = new Date().getTime();
	    this.fps++;
	   	
	   	let timeInterval = ( timeNow - this.timeLast );
	    if ( timeInterval >= 1000 ) {

			// dt = 1.0f;
		    this.deltaTime = Number( timeInterval / 1000.0 ).toFixed( 1 );
			
	        outFps.textContent  = "FPS: " + Number( this.fps * 1000.0 / timeInterval ).toPrecision( 5 );
	        //fpsElement.textContent  = "FPS: " + fps;
	        
	        // reset
	        this.timeLast = timeNow;
	        this.fps = 0.0;
	    }
	}
};


WR3D.MAIN = function( funGame ){
	
	window.onload =  function() {
		WR3D.mb3DScreenSaver( 'mb3DScreenSarver', 5000);
		
		funGame();
		

	}
}

WR3D.Init  = function( canvasid, debugFlag ){
	
	// note: if initialize var debug true if false!
	if( debugFlag !== undefined ) {DEBUG_ENGINE = debugFlag; }
	
	this.Time.init('fps');
	
	var canvas = document.getElementById( canvasid );
	gl = canvas.getContext( 'webgl2' );// experimental-webgl
	
	if (!gl) alert('Your browser does not support WebGL2! :-(');
	
	WR3D.sizeCanvas();
	gl.viewport( 0, 0,  gl.canvas.width, gl.canvas.height );
	canvasWidth 		= gl.canvas.width;
	canvasHeight 		= gl.canvas.height;
	aspectDifference 	= ( gl.canvas.clientWidth / gl.canvas.clientHeight );

	// note: Set clear color to black, fully opaque.
	gl.clearColor(0.1, 0.1, 0.1, 1.0);
	gl.clearDepth(1.0);                 				// Clear everything.	
  	gl.cullFace(gl.BACK);								// Back is also default.
	gl.frontFace(gl.CCW);								// Dont really need to set it, its ccw by default.
	gl.enable(gl.DEPTH_TEST);							// Shouldn't use this, use something else to add depth detection.
	gl.enable(gl.CULL_FACE);							// Cull back face, so only show triangles that are created clockwise.
	gl.depthFunc(gl.LEQUAL);							// Near things obscure far things.
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);	// Setup default alpha blending.
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);		// Rotate testure opengl Y axis.	
	
	//------------------------------
	// nopte:INITIALIZE EVENT HANDLERS....
	gl.canvas.addEventListener( "mousemove", function ( event ) {
		// note: when cursor hide.
 		mouseEventHideCursorXY.X = event.movementX;
 		mouseEventHideCursorXY.Y = event.movementY;
		//cout("mousemove: " + event.movementX + ", " + event.movementY);
	});


	window.addEventListener( "mouseout", function( event ){
		// cursor out focus.
		this.stateMouse = false;
		//cout( event.isTrusted );
	});

	// note: Event window resize. 
	window.addEventListener( "resize", function( event ){
		// setting size canvas.
		WR3D.sizeCanvas();
		
	  	gl.viewport( 0, 0, gl.canvas.width, gl.canvas.height );
	  	this.aspectDifference = ( gl.canvas.clientWidth / gl.canvas.clientHeight );
	});
	


	

	window.addEventListener( "onbeforeunload", function(){
		alert("Спасибо что посетили мой сайт. ^_^");
	});

	// note: Event mouse button down to canvas.
	canvas.addEventListener( "mousedown", function( event ){
		btnListMouse[event.button] = true;
		//cout(true);
	});

	// note: Event mouse button up to canvas.
	canvas.addEventListener( "mouseup", function( event ){
		btnListMouse[event.button] = false;
		//cout(false);
	});



	return this;
}

WR3D.sizeCanvas = function(){
	// Lookup the size the browser is displaying the canvas.
    var displayWidth  = gl.canvas.clientWidth; 	// loading settings in css mb3D.css
    var displayHeight = gl.canvas.clientHeight;	// loading settings in css mb3D.css
 
    // Check if the canvas is not the same size.
    if ( gl.canvas.width  !== displayWidth || gl.canvas.height !== displayHeight ) {

      // Make the canvas the same size
      gl.canvas.width  = displayWidth;
      gl.canvas.height = displayHeight;
    }
}

WR3D.mb3DScreenSaver = function( divId, speedOut ){
	var div = document.getElementById(divId);

	//var div = document.createElement("div");
	//div.setAttribute("id","divId");
	//document.body.appendChild(div);
	if( div !== undefined ){
		
		
		div.style.width 			= "600px";
		div.style.height 			= "315px";
		div.style.position 			= "fixed";
		div.style.left 				= "50%";
		div.style.top				= "50%";
		div.style.transform 		= "translate(-50%,-50%)";
		div.style.dorder 			= "1px colid red";
		div.style.color				= "#f82";
		div.style.fontSize			= "15px";
		div.style.paddingLeft 		= "30px";
		div.style.paddingTop 		= "20px";
		div.style.backgroundSize  	= "cover";
		div.style.background 		= "#262626 url('img/screenSaver.png')"; 
		div.innerHTML 				= "<p style='color:white;'> ver: 0.01 </p>";
		

		/*var seconds = speedOut/1000;
	    div.style.transition = "opacity "+seconds+"s ease";*/
	    
	    div.onclick  = function(){
	    	WR3D.flag = false;
	    	div.style.opacity = 0;
	    	div.parentNode.removeChild( div );
		    
		}	
	   /* div.style.opacity = 0;
	    setTimeout(function() {
	        div.parentNode.removeChild(div);
	    }, speedOut);*/
	}
};

WR3D.addScene = function( scenefunc ){

	this.sceneFunction = scenefunc;
	
}

WR3D.Renderer = function(){

	// key events call function... 		
	document.onkeydown 		= this.handleKeyDown;
    document.onkeyup 		= this.handleKeyUp;
    document.onmousemove 	= this.hendleMouseMoveInCanvas;
    //cout('mouseClient: '+ mouseEventXY.X +'x'+ mouseEventXY.Y);

	// Clear to black, fully opaque
	gl.clearColor(0.2, 0.3, 0.3, 1.0);  
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	 
	
	// draw scene callback finction.
  	this.sceneFunction(); 	

	// update dt & fps....	
	this.Time.FPS();
}

WR3D.Run = function(){
	
	WR3D.Renderer();
    requestAnimationFrame( WR3D.Run );	
}

WR3D.handleKeyDown = function( event ) {
	
	btnListKeyboard[event.keyCode] = true;
}

WR3D.handleKeyUp = function( event ) {
   
    btnListKeyboard[event.keyCode] = false;
}


WR3D.hendleMouseMoveInCanvas = function( event ){
	// note: event mouse move in region canvas.
	mouseEventXY.X = event.clientX;
	mouseEventXY.Y = event.clientY;  
}





////////////////////////////////////////////////////////////////////////////////
// CAMERA FREE.
WR3D.CameraFree = function( position, step=0.1, viewAngle=45.0, viewFar=500.0 ){
	
	this.fieldOfView 		= radians(viewAngle);   
  	this.zNear 				= 0.1;
  	this.zFar 				= viewFar;
  	this.Zoom 				= 45.0;
  	this.projectionMatrix 	= mat4.create();
  	mat4.perspective( this.projectionMatrix, this.fieldOfView, aspectDifference, this.zNear, this.zFar );
  	
  	// yaw is initialized to -90.0 degrees since a yaw of 0.0 results 
  	// in a direction vector pointing to the right so we initially rotate a bit to the left.
  	var yaw   	= -90.0;	
	var pitch 	= 0.0;
	var roll 	= 0.0;

  	
	// CREATE SPACE CAMERA.  
	this.viewMatrix 	= mat4.create();
	this.position 		= position;
	this.cameraFront 	= vec3.fromValues( 0.0, 0.0, -1.0 );
	this.stepY 			= vec3.fromValues( 0.0, 0.4, 0.0 );
	mat4.lookAt( this.viewMatrix, this.position, this.position , vec3.fromValues( 0.0, 1.0, 0.0 ) );
	
	
	// note: translate camera keyboard.
	this.CameraWSAD = function(){
		// debug....
		//cout(aspectDifference);

		var vecSpeedDT = vec3.fromValues( WR3D.Time.deltaTime, WR3D.Time.deltaTime, WR3D.Time.deltaTime );
		vecSpeedDT[0] = vecSpeedDT[1] = vecSpeedDT[2] *= step;

		var vecMultiply = vec3.create();
		
		// (X axis)
		if ( btnListKeyboard[Key.a] ) { 
		
			var vecRes = vec3.create();
			vec3.cross( vecRes, this.cameraFront, vec3.fromValues( 0.0, 1.0, 0.0 ) );	
			vec3.normalize( vecRes, vecRes );
           
           	vec3.multiply( vecMultiply, vecSpeedDT, vecRes );
           	//vec3.multiply(vecMultiply, vecSpeedDT, vec3.fromValues(0.1, 0.0, 0.0));
           	vec3.sub( this.position, this.position, vecMultiply );
        }
        if ( btnListKeyboard[Key.d] ) { 
           	var vecRes = vec3.create();
			vec3.cross(vecRes, this.cameraFront, vec3.fromValues(0.0, 1.0, 0.0));	
			vec3.normalize(vecRes,vecRes); 

			vec3.multiply(vecMultiply, vecSpeedDT, vecRes);
           	//vec3.multiply(vecMultiply, vecSpeedDT, vec3.fromValues(-this.stepX, 0.0, 0.0));
           	vec3.add(this.position, this.position, vecMultiply );
        } 
        
        // (Y axis)
        if (btnListKeyboard[Key.z]) { 
           vec3.multiply(vecMultiply, vecSpeedDT, this.stepY);
           vec3.sub(this.position, this.position, vecMultiply );
        }
        if (btnListKeyboard[Key.x]) { 
            vec3.multiply(vecMultiply,  vecSpeedDT, this.stepY);
			vec3.add(this.position, this.position, vecMultiply);
           
        }


        // (Z axis) 
        if (btnListKeyboard[Key.w]) {     
        
        	vec3.multiply(vecMultiply, vecSpeedDT, this.cameraFront);
            //vec3.multiply(vecMultiply, vecSpeedDT, vec3.fromValues(0.0, 0.0, -this.stepZ));
			vec3.add(this.position, this.position, vecMultiply ); 	
        } 
        if (btnListKeyboard[Key.s]) { 
        	vec3.multiply(vecMultiply, vecSpeedDT, this.cameraFront); 
            //vec3.multiply(vecMultiply,  vecSpeedDT, vec3.fromValues(0.0, 0.0, this.stepZ));
			vec3.sub(this.position, this.position, vecMultiply);
           
        }
       
        // update mat4 view & projection...
        var sum = vec3.create();
		vec3.add(sum, this.position, this.cameraFront); 
		mat4.lookAt(this.viewMatrix, this.position, sum , vec3.fromValues(0.0, 1.0, 0.0));
		mat4.perspective(this.projectionMatrix, this.fieldOfView, aspectDifference, this.zNear, this.zFar);
	
	};

	pointer_lock = false;

	// METHOD: move camera mouse.
	this.CameraMouse = function(){

		// click on canvas event hide cursor.
		{
			gl.canvas.ondblclick = function() { 			
				// chek...
				if ( document.pointerLockElement 	=== gl.canvas ||
	   			document.mozPointerLockElement   	=== gl.canvas ||
	   			document.webkitPointerLockElement 	=== gl.canvas ) {
					//cout('The pointer lock status is now locked');				
				} else {
					//cout('The pointer lock status is now unlocked');	
					pointer_lock = true;
					gl.canvas.requestPointerLock();
	    		}
	    	}
	 
	 		// check out state lock cursor.
			if ( document.pointerLockElement 		=== gl.canvas ||
	   			document.mozPointerLockElement   	=== gl.canvas ||
	   			document.webkitPointerLockElement 	=== gl.canvas ){}
			else pointer_lock = false;

		}


		
	  
	   // note: section mov camera.	( 11/09/19 add btnListMouse[btnLeft] for move camera mouse btn down to canvas )
	   if( pointer_lock  || btnListMouse[btnLeft] ){

			var sensitivity = 0.1;
			var xoffset =  mouseEventHideCursorXY.X; //- this.lastX
		    var yoffset = -mouseEventHideCursorXY.Y; // reversed since y-coordinates go from bottom to top
		   
	    	xoffset *= sensitivity;
	    	yoffset *= sensitivity;

	    	yaw 	+= xoffset;
	    	pitch 	+= yoffset;

		    // note: make sure that when pitch is out of bounds, screen doesn't get flipped
		    if ( pitch > 89.0 )  pitch =  89.0;
		    if ( pitch < -89.0 ) pitch = -89.0;
		    
		    this.cameraFront[0] = Math.cos( radians( yaw ) ) * Math.cos( radians( pitch ) );
		    this.cameraFront[1] = Math.sin( radians( pitch ) );
		    this.cameraFront[2] = Math.sin( radians( yaw ) ) * Math.cos( radians( pitch ) );
			vec3.normalize( this.cameraFront, this.cameraFront ); 
			
			
			// note: reset coords.
			mouseEventHideCursorXY.X = 0.0;
			mouseEventHideCursorXY.Y = 0.0;
	   }


	   
	    // debug to console...
	    //cout(this.cameraFront[0]+' '+this.cameraFront[1]);

	};

	// METHOD: scroll camera angel view.
	this.CameraScroll = function(){
		if (this.Zoom >= 1.0 && this.Zoom <= 45.0)
			this.Zoom -= 0.0;//yoffset!!
		if (this.Zoom <= 1.0)
			this.Zoom = 1.0;
		if (this.Zoom >= 45.0)
			this.Zoom = 45.0;
	};

};


////////////////////////////////////////////////////////////////////////////////
// BUFFER OPENGL.
WR3D.glBuffer = function( dataMesh, indices ){
	this.VAO = null;
	this.IBO = null;
	this.VBO = null;

	if(dataMesh == undefined)return;

	this.VBO = gl.createBuffer();
	this.VAO = gl.createVertexArray();

	gl.bindVertexArray(this.VAO);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dataMesh), gl.STATIC_DRAW);
	
	gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE);
	gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_USAGE);
	
	if(indices != undefined){
		this.IBO = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IBO);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices), gl.STATIC_DRAW);
		
	}


	//gl.bindBuffer(gl.ARRAY_BUFFER, null)
	//gl.bindVertexArray(null)
	
	return this;
}


WR3D.glBuffer.prototype.UseBuffer = function(){
	
	gl.bindVertexArray( this.VAO );

};

WR3D.glBuffer.prototype.UnUseBuffer = function(){

	gl.bindVertexArray(null);
};

WR3D.glBuffer.prototype.SetAttributeDefault = function( attribut_id = ATTR_LOCATION_POSITION, read, setonevertex, offset ){

    gl.vertexAttribPointer( attribut_id, read, gl.FLOAT, false, setonevertex, offset );
    gl.enableVertexAttribArray( attribut_id );	  
};





////////////////////////////////////////////////////////////////////////////////
// SHADER PROGRAM GLSL.
WR3D.glProgram =  function( vsSource, fsSource ){

	// function load shader sesources.
	var loadShader = function(gl, type, source){
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
  		};

  		return shader;
	}


	this.vertexShader 		= loadShader(gl, gl.VERTEX_SHADER,vsSource);
	this.fragmentShader 	= loadShader(gl, gl.FRAGMENT_SHADER,fsSource);
	this.Program  			= gl.createProgram();

	gl.attachShader(this.Program, this.vertexShader);
  	gl.attachShader(this.Program, this.fragmentShader);
  	gl.linkProgram(this.Program);

  	// If creating the shader program failed, alert
  	if (!gl.getProgramParameter(this.Program, gl.LINK_STATUS)) {
    	alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(this.Program));
    	return null;
  	}

  	// --------------------- METHODS ------------------------//

  	// get uniform location id glsl.
  	this.getUniformID = function(_nameUniform){
  		return gl.getUniformLocation(this.Program, _nameUniform);
  	};

  	// get attribute location id glsl.
  	this.getAttribLocationID = function(_nameUniform){
  		return gl.getAttribLocation(this.Program, _nameUniform);
  	};


  	// method setting attribut variable.	
	this.SetAttribute = function(nameAttr,read,setonevertex,offset){
		var AttrLocID = this.gl.getAttribLocation(this.Program, nameAttr);
	    gl.vertexAttribPointer(AttrLocID, read, gl.FLOAT, false, setonevertex, offset);
	    gl.enableVertexAttribArray(AttrLocID);	  
	};

  	// method using shader program glsl.
  	this.Use = function(){
  		gl.useProgram(this.Program);
  	};

  	// method using shader program glsl.
  	this.UnUse = function(){
  		gl.useProgram(null);
  	};

  	// setting uniform variable glsl.
  	this.setUniformMat4 = function( nameUniformMat4 , mat4 ){

  		gl.uniformMatrix4fv( this.getUniformID( nameUniformMat4 ), false, mat4 );
  		return this;
  	}

  	this.setUniformTexure = function( nameSampler , index ){
  		gl.uniform1i( this.getUniformID( nameSampler ), false, index );
  		return this;
  	}

  	return this;
};


////////////////////////////////////////////////////////////////////////////////
// LOAD TEXTURE OPENGL.
var glImage = function(){
	this.textureID 		=  null;
	this.targetTexture 	=  gl.TEXTURE_2D;
	
	/* 
	FilterMin :gl.LINEAR,	            	// метод фильтра использовать во время минимизации ( gl.LINEAR_MIPMAP_LINEAR )
	FilterMax : gl.LINEAR,					// метод фильтра использовать во время увеличения
	CoordS    : gl.REPEAT,               	// метод обтекания S-координаты
	CoordT    : gl.REPEAT,               	// метод обертывания Т-координаты
	CoordR    : gl.REPEAT,              	// метод обтекания R-координаты
	targetTexture : gl.TEXTURE_2D			// 1D,2D,3D...
	*/

	return this;
}


glImage.prototype.Tex2D = function( path ){
	
	this.targetTexture 	=  gl.TEXTURE_2D;
	// note: Create or create default testure.
	if( path === undefined )
	{	
		debug ( "You did not record the path to the texture!" );
		
		// note: load default testure2D.
		let texture = this.textureID = gl.createTexture();
		texture.image = new Image();
		
		texture.image.onload = function()
		{
			gl.bindTexture( gl.TEXTURE_2D, texture );
			gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image );
				gl.generateMipmap( gl.TEXTURE_2D );
				gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR ); 
				gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
				gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT ); 
				gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
			gl.bindTexture( gl.TEXTURE_2D, null );
		};
		texture.image.src = './img/def.png';

		// note: load default color texture.
		texture.image.onerror = function(){
			debug ( "You did not loaded to the texture!" );
				
			glImage.Tex2D.prototype.colorTex2D( texture, 220,220,220,255 );
			/*
				//gl.activeTexture( gl.TEXTURE0 );
				gl.bindTexture( gl.TEXTURE_2D, texture );
				var white = new Uint8Array( [ 220, 220, 220, 255 ] );
				gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, white );
				gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
				gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
				gl.bindTexture( gl.TEXTURE_2D, null );
			*/
		};

		return;
	}

	// note: if have path to testure.
	let texture = this.textureID = gl.createTexture();
	texture.image = new Image();
	texture.image.onload = function()
	{
		gl.bindTexture( gl.TEXTURE_2D, texture );
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image );
			gl.generateMipmap( gl.TEXTURE_2D );
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR ); 
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT ); 
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
		gl.bindTexture( gl.TEXTURE_2D, null );
	};
	texture.image.src = path;
	
	return this;
}

glImage.prototype.TexCube =  function( blockDivTexId ){
	let targets = [
                    gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
                    gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
                    gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z 
                 ];
    let ccc = document.getElementById( blockDivTexId ).getElementsByTagName('img');
    
	this.targetTexture 	= gl.TEXTURE_CUBE_MAP;//TEXTURE_CUBE_MAP
	this.textureID 		= gl.createTexture();
	gl.bindTexture( this.targetTexture, this.textureID );
	
	// note: Load testure.
	for( var i = 0; i < 6; i++ ){
		//gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL,  true );
        gl.texImage2D( targets[i] , 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ccc[i] );
	}
	
	gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR ); 
	gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
	gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
    gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
    gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE );
    gl.generateMipmap( gl.TEXTURE_CUBE_MAP);
	gl.bindTexture( gl.TEXTURE_CUBE_MAP, null );

	return this;
}


glImage.prototype.Use  = function( samplerID=0 ){
	gl.activeTexture( gl.TEXTURE0 + samplerID );
	gl.bindTexture( this.targetTexture, this.textureID );
		
	
	return this;	
}


glImage.prototype.UnUse = function(){
	gl.bindTexture( this.targetTexture, null );
	gl.activeTexture( gl.TEXTURE0 );
	return this;	
}


glImage.prototype.colorTex2D = function( texId, r, g, b, a ){
	// note: Array 8bits unsigned integer (0-255)
	
	//gl.activeTexture( gl.TEXTURE0 );
	gl.bindTexture( gl.TEXTURE_2D, texId );
	var white = new Uint8Array( [ r, g, b, a ] );
	gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, white );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
	gl.bindTexture( gl.TEXTURE_2D, null );

	return this;
}




////////////////////////////////////////////////////////////////////////////////
// PRIMITIV GL ( BOX. QUAD, PLANE... )
WR3D.glPrimitive = {
	buffer: null,
	data:0, 
	indices:0
};

// PRIMITIV BOX.
WR3D.glPrimitive.Box = function( scale = 1.0 ){

	// note: if 0.5 == 1, if 1 == 2, if 2 == 4.... 
	var colTex = ( scale / 0.5 );

	//this.testure = textureObject;
	this.data = 
	[ // X, Y, Z           	COLOR		U, V
		// Top
		-scale, scale, -scale,  1.0,0.0,0.0,	0, 0,
		-scale, scale, scale,   1.0,0.0,0.0,	0, colTex,
		scale, scale, scale,    1.0,0.0,0.0,	colTex, colTex,
		scale, scale, -scale,   1.0,0.0,0.0,	colTex, 0,

		// Left
		-scale, scale, scale,    0.0,1.0,0.0,	0, 0,
		-scale, -scale, scale,   0.0,1.0,0.0,	colTex, 0,
		-scale, -scale, -scale,  0.0,1.0,0.0,	colTex, colTex,
		-scale, scale, -scale,   0.0,1.0,0.0,	0, colTex,

		// Right
		scale, scale, scale,    0.0,0.0,1.0,	colTex, colTex,
		scale, -scale, scale,   0.0,0.0,1.0,	0, colTex,
		scale, -scale, -scale,  0.0,0.0,1.0,	0, 0,
		scale, scale, -scale,   0.0,0.0,1.0,	colTex, 0,

		// Front
		scale, scale, scale,    1.0,1.0,0.0,	colTex, colTex,
		scale, -scale, scale,   1.0,1.0,0.0,	colTex, 0,
		-scale, -scale, scale,  1.0,1.0,0.0,  	0, 0,
		-scale, scale, scale,   1.0,1.0,0.0,	0, colTex,

		// Back
		scale, scale, -scale,   0.0,1.0,1.0,	0, 0,
		scale, -scale, -scale,  0.0,1.0,1.0, 	0, colTex,
		-scale, -scale, -scale, 0.0,1.0,1.0,   	colTex, colTex,
		-scale, scale, -scale,  0.0,1.0,1.0,   	colTex, 0,

		// Bottom
		-scale, -scale, -scale, 1.0,0.0,1.0,  colTex, colTex,
		-scale, -scale, scale,  1.0,0.0,1.0,  colTex, 0,
		scale, -scale, scale,   1.0,0.0,1.0,  0, 0,
		scale, -scale, -scale,  1.0,0.0,1.0,  0, colTex,
	];


	this.indices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];


	this.buffer = new WR3D.glBuffer( this.data, this.indices );
	
	this.buffer.UseBuffer();
		this.buffer.SetAttributeDefault(ATTR_LOCATION_POSITION, 3, 32, 0);
		this.buffer.SetAttributeDefault(ATTR_LOCATION_COLOR, 3, 32, 12);
		this.buffer.SetAttributeDefault(ATTR_LOCATION_UVCOORD, 2, 32, 24);
	this.buffer.UnUseBuffer();
	
	

	// method paint mesh box.
	this.DrawMesh = function(textureObject){
		//textureObject.UseTexture();
		this.buffer.UseBuffer();
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
		//gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
	};

	return this;
};


// PRIMITIV PLANE.
WR3D.glPrimitive.Plane = function( scale = 1.0 ){

	// note: if 0.5 == 1, if 1 == 2, if 2 == 4.... 
	var colTex = ( scale / 0.5 );

	// plane vertex
	this.data = [
		// position   		color       UV
		// Bottom
		-scale, 0.0, -scale, 1.0,0.0,1.0,  colTex, colTex,
		-scale, 0.0, scale,  1.0,0.0,1.0,  colTex, 0,
		scale, 0.0, scale,   1.0,0.0,1.0,  0, 0,
		scale, 0.0, -scale,  1.0,0.0,1.0,  0, colTex,
	];

	// plane index
	this.indices=[

		0, 1, 2,
		0, 2, 3,

	];

	this.buffer = new WR3D.glBuffer( this.data, this.indices );

	this.buffer.UseBuffer();
		this.buffer.SetAttributeDefault( ATTR_LOCATION_POSITION, 3, this.data.length, 0 );
		this.buffer.SetAttributeDefault( ATTR_LOCATION_COLOR,    3, this.data.length, 12 );
		this.buffer.SetAttributeDefault( ATTR_LOCATION_UVCOORD,  2, this.data.length, 24 );
	this.buffer.UnUseBuffer();
	
	

	// method paint mesh box.
	this.DrawMesh = function(textureObject){
		//textureObject.UseTexture();
		this.buffer.UseBuffer();
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
		//gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
	};

	return this;
}; 

// PRIMITIV QUAD
WR3D.glPrimitive.Quad = function( scale = 1.0, color ){
	// an indexed quad
	var arrays = {
	   position: { numComponents: 3, data: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0], },
	   texcoord: { numComponents: 2, data: [0, 0, 0, 1, 1, 0, 1, 1],                 },
	   normal:   { numComponents: 3, data: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],     },
	   indices:  { numComponents: 3, data: [0, 1, 2, 1, 2, 3],                       },
	};

	
	this.data =[
		-scale, -scale, 0,	color[0],color[1],color[2],	0, 0,	 
		scale, -scale,  0,	color[0],color[1],color[2],	0, 1,
		scale,  scale,  0, 	color[0],color[1],color[2],	1, 1,
		-scale, scale,  0,	color[0],color[1],color[2],	1, 0
	];


	this.indices =[0, 1, 2, 0, 2, 3];
	

	this.buffer = new WR3D.glBuffer( this.data, this.indices );
	
	this.buffer.UseBuffer();
		this.buffer.SetAttributeDefault(ATTR_LOCATION_POSITION, 3, this.data.length, 0);
		this.buffer.SetAttributeDefault(ATTR_LOCATION_COLOR, 	3, this.data.length, 12);
		this.buffer.SetAttributeDefault(ATTR_LOCATION_UVCOORD, 	2, this.data.length, 24);
	this.buffer.UnUseBuffer();
	
	

	// method paint mesh box.
	this.DrawMesh = function(textureObject){
		//textureObject.UseTexture();
		this.buffer.UseBuffer();
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
		//gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
	};

	return this;
};


////////////////////////////////////////////////////////////////////////////////
// SKYBOX
WR3D.Skybox = function( blockDivTexId ){
	
	// note: variabels.
	this.shaderSky 	= new WR3D.glProgram( LibShader.glslSkybox.VS, LibShader.glslSkybox.FS );
	this.testure 	= new glImage().TexCube( blockDivTexId );
	this.box 		= new WR3D.glPrimitive.Box( 1.0 );

	// note: Method draw.
	this.draw = function( camera ){

		// note: transfer  variables the uniform to shader program.
		this.shaderSky.Use();
		this.shaderSky.setUniformMat4( 'uViewMatrix', 			camera.viewMatrix );
		this.shaderSky.setUniformMat4( 'uProjectionMatrix', 	camera.projectionMatrix );
		this.shaderSky.setUniformMat4( 'uModelViewMatrix', 		objMove( [3.0, 0.0, 0.0] ) );
		this.shaderSky.setUniformTexure( 'cubeTexture', 0 );
		

		// note: active senpler cube texture.
		this.testure.Use(0);
		
		// note: old state pipeline opengl.
	    var OldCullFaceMode = gl.getParameter( gl.CULL_FACE_MODE );
	    var OldDepthFuncMode = gl.getParameter( gl.DEPTH_FUNC );
	    	// note: mutable state pipeline opengl.
	    	gl.cullFace(gl.FRONT);
	    	//gl.depthFunc(gl.LEQUAL);
	    		
	    		// note: Droe box with tetures.
				this.box.DrawMesh();
			
			// note: retern old state pipeline opengl.	
			gl.cullFace(OldCullFaceMode);        
    		//gl.depthFunc(OldDepthFuncMode);
	}
};


