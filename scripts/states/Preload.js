var preload = function(game){
}

preload.prototype = {

	preload: function(){ 
	
		// Load "Menu" state assets
		this.load.image('gametitle', 'images/basicLayout/tokens.jpg');
		this.load.image('play', 'images/basicLayout/playBtn.jpg');
          
		// Load "StartGame" state assets and pre-define physics system 
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.load.image('lane', 'images/basicLayout/clear.png');
		this.load.image('token', 'images/basicLayout/tokens.jpg');
		this.load.image('ground', 'images/basicLayout/ground.jpg');
		this.load.image('enemy', 'images/basicLayout/enemy.jpg');
		this.load.spritesheet('playerMain', 'images/basicLayout/sprite.jpg', 300, 100, 3);
		
	},
	
  	create: function(){
  	
  		// Load "Menu" state assets
		this.game.state.start("Menu");
	}
	
}