var startGame = function(game){

	// Instantiate variables
	var text, ground, mainPlyr, lftRect, ctrRect, rghtRect, arrPrfx, currMstrDrop, curSpriteSel, currSpriteIndx, tokens, bombs, tokenSprite, bombSprite, lftSprites, cntrSprites, rghtSprites, mstrSprites, lftDrop, cntrDrop, rghtDrop, mstrDropArr;

	// Assign total, score, and scoreText to game object
	this.total = 0;
	this.score = 0;
	this.scoreText = null;
	
}
 
startGame.prototype = {
			
			
	create: function() {
	
		/* Sprites constructor function serves to create the datastore 
		to house and retrieve the enemy and token objects in the game */
		function Sprites() {
			this.datastore = [];
		
			this.add = function(key, value){
				this.datastore.push({
					key: key,
					value: value
				});
				return this.datastore;
			};
		
			this.find = function(key){
				for(var i =0; i < this.datastore.length; i++){
					if(this.datastore[i].key === key){
					return this.datastore[i].value;
				}
			}
			return this.datastore;
			};
		};	
		
		/* Instantiate sprite objects; All falling game sprites are created 
		from either the lftSprites, cntrSprites, rghtSprites; */
		lftSprites = new Sprites();
		cntrSprites = new Sprites();
		rghtSprites = new Sprites();
		
		// Push all sprites to mstrSprites array
		mstrSprites = [lftSprites, cntrSprites, rghtSprites];
		
		/* Instantiate sprite drop objects; All falling game sprites are assigned
		a drop position per their corresponding Sprite [protytpe]. 
		Each _Drop object contains the coordinates for drop, the "token" / "bomb" 
		drop sequence, the gravity values associated with each "token" or "bomb" 
		sprite, and the objects assigned prefix.*/
		lftDrop = {
			coordinates: {
				x: 25,
				y:  -50
			},
			dropSeq:  ["token", "token", "bomb", "token", "bomb", "bomb", "token", "token"],
			gravSeq: [300, 10, 400, 50, 600, 85, 150, 400],
			dropPrfx: "lft",
			dropSprites: []
		};
		cntrDrop = {
			coordinates: {
				x: 125,
				y:  -50
			},
			dropSeq:  ["token", "bomb", "bomb", "bomb", "bomb", "token", "token", "bomb"],
			gravSeq: [300, 10, 400, 50, 600, 85, 150, 400],
			dropPrfx: "cntr",
			dropSprites: []
		};
		rghtDrop = {
			coordinates: {
				x: 225,
				y:  -50
			},
			dropSeq:  ["bomb", "token", "token", "token", "bomb", "token", "token", "token"],
			gravSeq: [300, 10, 400, 50, 600, 85, 150, 400],
			dropPrfx: "rght",
			dropSprites: []
		};

		// Push all sprites to mstrDropArr array
		mstrDropArr = [lftDrop, cntrDrop, rghtDrop];
		
		// Create "ground" aesthetic 				
		ground = this.add.image(0, this.world.height - 50, 'ground' );
		ground.scale.setTo(60, 1);
		
		// Create game loop to continuously drop "token" or "bomb" sprites
		this.game.time.events.repeat(Phaser.Timer.SECOND * 2, 8, this.timerCheck, this);
						
		/* Create mainPlyr sprite aesthetic; assigned full width of the ground 
		to cover against the "token" or "bomb" sprites. 
		Assign right and left key down animation triggers; sprite is immoveable 
		and assigned arcade physics */
		mainPlyr = this.add.sprite(0, this.world.height - 150, 'playerMain' );
		this.physics.enable(mainPlyr, Phaser.Physics.ARCADE);
		mainPlyr.animations.add('left', [0], 1, true);
		mainPlyr.animations.add('right', [2], 1, true);
		mainPlyr.enableBody = true;
		mainPlyr.body.immovable = true;               
		
		/* Each _Rect acts as a coordinate for collision detection against the 
		falling "token" or "bomb" sprites. Points are calculated per the collision
		detection between the _Rect and the sprites falling in the 
		corresponding _Drop */
		lftRect = this.add.sprite(25, this.world.height - 150, 'lane');
		this.physics.enable(lftRect, Phaser.Physics.ARCADE);
		lftRect.enableBody = true;        
		lftRect.body.setSize(100, 100, 0, 0);

		ctrRect = this.add.sprite(125, this.world.height - 150, 'lane');
		this.physics.enable(ctrRect, Phaser.Physics.ARCADE);
		lftRect.enableBody = true;        
		ctrRect.body.setSize(100, 100, 0, 0);

		rghtRect = this.add.sprite(225, this.world.height - 150, 'lane');
		this.physics.enable(rghtRect, Phaser.Physics.ARCADE);
		lftRect.enableBody = true;        
		rghtRect.body.setSize(100, 100, 0, 0);
		
		
		// Enable cursor keys as controls
		this.cursors = this.input.keyboard.createCursorKeys();
		
		// Create "tokens" sprite group
		tokens = this.add.group();
		tokens.enableBody = true; 
		this.physics.enable(tokens, Phaser.Physics.ARCADE);
		
		// Create "bombs" sprite group
		bombs = this.add.group();
		bombs.enableBody = true; 
		this.physics.enable(bombs, Phaser.Physics.ARCADE);

		/* Feed _Drop objects through dropLoop; Creates "token" or "bomb" 
		sprite per object specification */
		this.dropLoop(lftDrop);
		this.dropLoop(cntrDrop);
		this.dropLoop(rghtDrop);
		
		// Create scoreText text [score keeper]
		this.scoreText = this.game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });
						
		
	},

	update: function() {

		if (this.cursors.left.isDown)
			{
				// LEFT MAIN ANIMATION
				mainPlyr.animations.play('left');
				
				// LFT RECT COLL DETECT
				this.game.physics.arcade.overlap(lftRect, tokens, this.tokenHit, null, this);                
				this.game.physics.arcade.overlap(lftRect, bombs, this.bombHit, null, this);
		
			}
		
		else if (this.cursors.right.isDown)
			{
				// RIGHT MAIN ANIMATION
				mainPlyr.animations.play('right');
				
				// RGHT RECT COLL DETECT
				this.game.physics.arcade.overlap(rghtRect, tokens, this.tokenHit, null, this);                
				this.game.physics.arcade.overlap(rghtRect, bombs, this.bombHit, null, this);                        
			}
		
		else
			{
				// RESET MAIN ANIMATION
				mainPlyr.animations.stop();
				mainPlyr.frame = 1;
				
				// CNTR RECT COLL DETECT
				this.game.physics.arcade.overlap(ctrRect, tokens, this.tokenHit, null, this);                
				this.game.physics.arcade.overlap(ctrRect, bombs, this.bombHit, null, this);
			}
		

	},
	 
	/*  Iterate through _Drop objects and create "token" or "bom" sprites 
	per the _Drop.dropSeq and additional specifications per the parent _Drop object */
	dropLoop: function ( posObj ){

		var dropCoorX = posObj.coordinates.x
		var dropCoorY = posObj.coordinates.y
		var dropSprite = posObj.dropSprites;

		var currIndx = 0;
		var dropArr = posObj.dropSeq;
		var mstrSpritePush = null;
		var spriteType = null;

		dropArr.forEach(function(currObj) {
			
			spriteType = dropArr[currIndx];
			
			if ( spriteType == "token" ){
				tokenSprite = tokens.create(dropCoorX, dropCoorY, 'token'); 
			}
			
			else {
				bombSprite = bombs.create(dropCoorX, dropCoorY, 'enemy');
			}
			
			var dropPos = posObj.dropPrfx + "Sprite" + currIndx; 
											
			if ( posObj.dropPrfx == "lft" ){mstrSpritePush = lftSprites}
			else if ( posObj.dropPrfx == "cntr" ){mstrSpritePush = cntrSprites}
			else if ( posObj.dropPrfx == "rght" ){mstrSpritePush = rghtSprites}
			
			if ( spriteType == "token" ){ mstrSpritePush.add( dropPos, tokenSprite ); }
			else if ( spriteType == "bomb" ) { mstrSpritePush.add( dropPos, bombSprite ); 			}
			
			currIndx++;
			
		})
		

	},
	
	/* Called every 2 seconds; iterates through sprites in "lft"/"cntr"/"rght" 
	position to assign physics and gravity value - ultimately determining when 
	the "token" or "bomb" object is dropped and how fast*/
	timerCheck: function() {
		
		for (var i = 0; i <= 2; i++){
			
				if(i === 0) {
					arrPrfx = "lft";
					currMstrDrop = lftDrop;
					curSpriteSel = lftSprites;
					currSpriteIndx = "lftSprite";
				}
			
				else if(i === 1) {
					arrPrfx = "cntr";
					currMstrDrop = cntrDrop;
					curSpriteSel = cntrSprites;
					currSpriteIndx = "cntrSprite";
				}
			
				else if(i === 2) {
					arrPrfx = "rght";
					currMstrDrop = rghtDrop;
					curSpriteSel = rghtSprites;
					currSpriteIndx = "rghtSprite";
				}
			
			var curSpriteKey = String(currSpriteIndx + this.total);
			console.log(curSpriteKey);
			
			var curSpriteGrav = currMstrDrop.gravSeq[this.total];

			var curSprite = curSpriteSel.find(curSpriteKey); 

			this.game.physics.arcade.enable(curSprite);
			curSprite.body.gravity.y = curSpriteGrav;

		};
		
		this.total++;
	},

	/* On "token" + _Drop collision, per player correct left/right/center 
	cursor key input, increment score 10pts and kill token object */
	tokenHit: function(rect, tokens) {  
		tokens.kill();
		
		this.score += 10;
		this.scoreText.text = 'Score: ' + this.score;
	},

	/* On "bomb" + _Drop collision, per player incorrect left/right/center 
	cursor key input, decrement score 10pts and kill bomb object */
	bombHit: function(rect, bombs) {
		bombs.kill();
		
		this.score -= 10;
		this.scoreText.text = 'Score: ' + this.score;
	}
	

}