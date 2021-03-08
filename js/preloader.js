/****************************************************
*	11/09/2019
*	WR3D Engine WebGL2.0 
*	https://github.com/maxcccp
* 	© Max ( https://mbprogrammer.com ) 
*	For learning JavaScript and WebGL...
*****************************************************/

;

var listImagesObjects 	= document.images;
var loadedImagesLength 	= listImagesObjects.length;
var loadedImagesCount 	= 0;

var percDisplay 		= document.getElementById('load_parc');
var preloader 			= document.getElementById('page-preloader');


if( loadedImagesLength > 0 ){


	for( var i = 0; i < loadedImagesLength; i++ ){

		var target_image = new Image();
		// event loading image object.
		target_image.onload 	= callback_image_loaded;
		// if event error loading image object.
		target_image.onerror 	= callback_image_loaded;
		
		// get path image object. 
		target_image.src 		= listImagesObjects[i].src;
		
		//console.log(target_image.src);
	}

	//console.log("Length: "+ loadedImagesLength);
	//console.log("Count: " + loadedImagesCount);

	// callbak function image.
	function callback_image_loaded()
	{
		loadedImagesCount++;
		
		//console.log("Count: " + loadedImagesCount);
		// formula: ( (100 / allImages) * carrentLoadedImages) !!! 0 - для отброса дробного числа
		percDisplay.innerHTML = ( ( ( 100 / loadedImagesLength) * loadedImagesCount ) << 0 )+'%';


		if( loadedImagesCount >= loadedImagesLength )
		{
			setTimeout(function(){
				
				if( !preloader.classList.contains( "done" ) ){

					preloader.classList.add( "done" );
				}

			},1000);
		}

}


}
else
{
	if( !preloader.classList.contains( "done" ) ){

		preloader.classList.add( "done" );
	}
}




