var boot = function(game){
	console.log("Boot");
};
  
boot.prototype = {

	preload: function(){
	},
	
  	create: function(){
  	
		/* Create canvas element that scales the height of the
		document and aligns horizontally with the document */
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.pageAlignHorizontally = true;
		
		// Load "Preload" state
		this.game.state.start("Preload");
	}
	
}