/****************************************************
*	11/09/2019
*	WR3D Engine WebGL2.0 
*	https://github.com/maxcccp
* 	© Max ( https://mbprogrammer.com ) 
*	For learning JavaScript and WebGL...
*****************************************************/

cout("work mb3DGui...");

mb3D.__proto__.Gui = {
	guiName:"mb3DGui",
	guiVersion:"v0.0.0.1",

};


Gui.__proto__.GuiLayaut = function(divApp){
	this.divLayerID = document.getElementById(divApp);
	this.divLayerVisible = false;
	
	this.divLayerID.style.opacity = 0;
	this.divLayerID.style.visibility = "hidden";
	
	
	
	

	this.add = function(component){

		return this;
	}


	this.show = function(){

		
		if(pressKeys[77]){
			this.divLayerVisible = !this.divLayerVisible;
			this.divLayerID.style.opacity = this.divLayerVisible ? "0.0" : "0.5";
			this.divLayerID.style.visibility = this.divLayerVisible ? "hidden" : "visible";
		}


	}
	return this;
}



