var mainMenu = function(game){

	// Assign gameplayDesc, gameTitle, and playButton to game object
	this.gameplayDesc = null;
	this.gameTitle = null;
	this.playButton = null;

}
 
mainMenu.prototype = {

  	create: function(){
  	
  		// Create and style introduction directions via this.gameplayDesc
  		this.gameplayDesc = this.game.add.text(0, 0, 'Use the arrow keys \nCatch the golden squares. \nAvoid enemy red squares.', { fontSize: '16px', fill: '#fff', boundsAlignH: "center", boundsAlignV: "middle" });
  		this.gameplayDesc.setTextBounds(100, 25, 50, 50);


  		// Create and place gameTitle element
		this.gameTitle = this.game.add.sprite(160,160,"gametitle");
		this.gameTitle.anchor.setTo(0.5,0.5);
		
		
  		/* Create and place playButton element; 
  		Assign playButton element to trigger start function on click */
		this.playButton = this.game.add.button(160,320,"play",this.start,this);
		this.playButton.anchor.setTo(0.5,0.5);
	},
	
	start: function(){
	
  		// Load "StartGame" state assets
		this.game.state.start("StartGame");
		
	}
	
}