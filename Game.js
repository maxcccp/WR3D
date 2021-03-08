/****************************************************
*	11/09/2019
*	WR3D Engine WebGL2.0 
*	https://github.com/maxcccp
* 	© Max ( https://mbprogrammer.com ) 
*	For learning JavaScript and WebGL...
*****************************************************/
;

var guiBoxZero = {
	Camera : "W,S,A,D,Z,X",
	Skybox : true 
};


// gui box1. 
var guiBoxOne = {
	// Box 1 (Menu)
    RotateX: false,
    RotateY: true,
    RotateZ: false,
    Speed: 0.05,

	UpdateMatrix : function(modelMat4,countRotate){
		// rotate matrix.
	  	mat4.rotate(modelMat4,  // destination matrix
          modelMat4,  // matrix to rotate
          countRotate * 0.1,     // amount to rotate in radians
          this.RotateZ ? [0, 0, 1]:[0, 0, 0]);       // axis to rotate around (Z)
		
		mat4.rotate(modelMat4,  	// destination matrix
          modelMat4,  		// matrix to rotate
          countRotate * 0.1 ,			// amount to rotate in radians
          this.RotateY ? [0, 1, 0]:[0, 0, 0]);       // axis to rotate around (Y)

		mat4.rotate(modelMat4,  	// destination matrix
          modelMat4,  		// matrix to rotate
          countRotate * 0.1,			// amount to rotate in radians
          this.RotateX ? [1, 0, 0]:[0, 0, 0]);       // axis to rotate around (X)
}

};

// gui box2.
var guiBoxTwo = {
	// BoxTwo (Menu)
    RotateX: false,
    RotateY: true,
    RotateZ: true,
    Speed: 0.05,

    UpdateMatrix : function(modelMat4,countRotate){
    	// rotate matrix.
	  	mat4.rotate(modelMat4,  // destination matrix
              modelMat4,  // matrix to rotate
              countRotate * 0.1,     // amount to rotate in radians
              this.RotateZ ? [0, 0, 1]:[0, 0, 0]);       // axis to rotate around (Z)
  		
  		mat4.rotate(modelMat4,  	// destination matrix
              modelMat4,  		// matrix to rotate
              countRotate * 0.1 ,			// amount to rotate in radians
              this.RotateY ? [0, 1, 0]:[0, 0, 0]);       // axis to rotate around (Y)

  		mat4.rotate(modelMat4,  	// destination matrix
              modelMat4,  		// matrix to rotate
              countRotate * 0.1,			// amount to rotate in radians
              this.RotateX ? [1, 0, 0]:[0, 0, 0]);       // axis to rotate around (X)
    }

};

// GUI INITIALIZEDE
function initGUI(){
	var gui = new dat.gui.GUI();

	var BoxZero = gui.addFolder( 'Information' );
	BoxZero.add( guiBoxZero, 'Camera' );
	BoxZero.add( guiBoxZero, 'Skybox' );

    var BoxOne = gui.addFolder('BoxOne');
	BoxOne.add(guiBoxOne, 'Speed', 0.0001, 1.0, 0.0001);
    BoxOne.add(guiBoxOne, 'RotateX');
    BoxOne.add(guiBoxOne, 'RotateY');
    BoxOne.add(guiBoxOne, 'RotateZ');

    var BoxTwo = gui.addFolder('BoxTwo');
	BoxTwo.add(guiBoxTwo, 'Speed', 0.0001, 1.0, 0.0001);
    BoxTwo.add(guiBoxTwo, 'RotateX');
    BoxTwo.add(guiBoxTwo, 'RotateY');
    BoxTwo.add(guiBoxTwo, 'RotateZ');

	//var guiLight = gui.addFolder('Light');
	//guiLight.add(guiAll, 'light', { ambient: 0, direction: 1, spotlight: 2 } );
}

// variable for apdate matrix rotate    	
var cubeRotation1 = 0;
var cubeRotation2 = 0;
function GuiUpdateGame( ){
	cubeRotation1 += guiBoxOne.Speed;
	cubeRotation2 += guiBoxTwo.Speed;
}


// note: Sound block...
function playSound(){

	// note: music....
	var SoundMusic = new Howl({
	  src: ['./sound/Delta_Wave.mp3'],
	  loop: true,
	  volume: 0.2,
	});

	// note: music....
	var WinterNight = new Howl({
	  src: ['./sound/WinterNight_OwlVoice.mp3'],
	  loop: true,
	  volume: 0.7,
	});

	// note: sound scene...
	WinterNight.play();	
	SoundMusic.play();
	
	var btnPlayStop = document.getElementById( "btnSound" );
		btnPlayStop.addEventListener( 'click', function( e ){
			if( SoundMusic.playing() == true ){
				btnPlayStop.innerHTML = "Play &#9658;";
			 	SoundMusic.pause();
			}
			else{
				btnPlayStop.innerHTML = "Pause &#9632;";
				SoundMusic.play();
			}

			/*debug( sound.playing() );	
    		console.log( e.target.getAttribute( 'id' ) );*/
	});


	var btnVolMax = document.getElementById( "btnVolMax" );
		btnVolMax.addEventListener( 'click', function( e ){
			let vol = SoundMusic.volume();

			vol += 0.1;
			if( vol > 1) vol = 1;

			SoundMusic.volume( vol );

			/*debug( sound.volume() );	
    		console.log( e.target.getAttribute( 'id' ) );*/
	});


	var btnVolMin = document.getElementById( "btnVolMin" );
		btnVolMin.addEventListener( 'click', function( e ){
			let vol = SoundMusic.volume();
			
			vol -= 0.1;
			if( vol < 0.1) vol = 0.1;
				
			SoundMusic.volume( vol );
			
			/*debug( sound.volume() );	
    		console.log( e.target.getAttribute( 'id' ) );*/
	});
}




// note: All GAME FUNCTION.
function GAME() 
{
	playSound();

	// note: init engine...
	initGUI();
	WR3D.Init( 'mbCamvas' );
	WR3D.Font.init();

	var camera 			= new WR3D.CameraFree( [0.0, 0.0, 3.0 ] );
	var glslShader1 	= new WR3D.glProgram( LibShader.shaderBase.VS, LibShader.shaderBase.FS );
	var textureTile 	= new glImage().Tex2D( './img/tile.jpg' );
	var textureFloor 	= new glImage().Tex2D( './img/diffuseFloor.jpg' );

	var box3D 			= new WR3D.glPrimitive.Box( 0.5 );
	var plane3D 		= new WR3D.glPrimitive.Plane( 6.0 );
	var quad3D 			= new WR3D.glPrimitive.Quad( 0.5, [ 1.0, 1.0, 5.0 ] );
	var textTexture 	= new WR3D.Font.createImgFont( "WR3D", 100, 150, "gray" );

	var skyBox 			= new WR3D.Skybox( 'blokSkybox' );



	// note: Scene namber 1.
	function scene()
	{
		//textTexture.ResetTexText("123");
		// update camera translate key: w-s-a-d.
		camera.CameraWSAD();
		camera.CameraMouse();

		// draw mesh.
		glslShader1.Use();
		glslShader1.setUniformMat4( 'uViewMatrix', camera.viewMatrix );
		glslShader1.setUniformMat4( 'uProjectionMatrix', camera.projectionMatrix );

		var mat4Model =  objMove( [-0.0, 0.0, -10.0] );
		guiBoxOne.UpdateMatrix( mat4Model, cubeRotation1 );
		glslShader1.setUniformMat4( 'uModelViewMatrix', mat4Model );

		// draw box1
		textureTile.Use();
		box3D.DrawMesh();

		// create model matrix for box 2.
		mat4Model =  objMove( [-3.0, 0.0, -8.0] );
		guiBoxTwo.UpdateMatrix( mat4Model, cubeRotation2 );
		glslShader1.setUniformMat4( 'uModelViewMatrix',mat4Model );
		
		// draw box2
		box3D.DrawMesh();
		
		

		// draw plane
		glslShader1.setUniformMat4('uModelViewMatrix', objMove( [0.0, -0.6, -4.0] ) ) ;
		textureFloor.Use();
		plane3D.DrawMesh();	


		// quad text..
		WR3D.Font.Shader.Use();
		WR3D.Font.Shader.setUniformMat4('uViewMatrix',camera.viewMatrix);
		WR3D.Font.Shader.setUniformMat4('uProjectionMatrix',camera.projectionMatrix);

		// draw plane
		textTexture.DrawText( [0.0, 0.0, -5.0] );
		quad3D.DrawMesh();	

		// note: Gui state...
		GuiUpdateGame();
		
		// note: Draw skybox.
	 	if( guiBoxZero.Skybox ) skyBox.draw( camera );
	   
	}


	WR3D.addScene( scene );

	WR3D.Run();

}

WR3D.MAIN( GAME );