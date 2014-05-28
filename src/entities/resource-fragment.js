define(function(require) {
	"use strict";

	var _ = require('lodash'),
		Phaser = require('phaser'),
		RADIANS_COEF = Math.PI / 180,
		instanceManager = require('instance-manager');
	
	function ResourceFragment(props) {
		var game = instanceManager.get('game');
		Phaser.Sprite.call(this, game, props.x, props.y, 'reseource-fragment');
		// XXX TEMP SIZE FOR PLACEHOLDER
		this.width = 10;
		this.height = 10;
		// END
		
		this.anchor.setTo(0.5, 1);
		this.revive();
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.allowGravity = true;
		this.body.collideWorldBounds = true;
		this.body.gravity.y = 400;
		this.spawn(props);
		game.add.existing(this);
	}
	
	ResourceFragment.LIFETIME = 4000;
	ResourceFragment.preload = function(game) {
		game.load.image('reseource-fragment', '');
	};
	
	ResourceFragment.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(ResourceFragment.prototype, {
		constructor: ResourceFragment,
		update: function() {
			
			if(this.y >= this.game.world.height) {
				this.body.velocity.x = 0;
			}
			
			if(this.spawnTime + ResourceFragment.LIFETIME < this.game.time.now) {
				this.kill();
			}
		},
		spawn: function(props) {
			this.reset(props.x, props.y);
			this.bringToTop();
			this.value = props.value;
			this.spawnTime = this.game.time.now;
			this.body.velocity.x = props.speed * Math.cos(props.angle * RADIANS_COEF);
			this.body.velocity.y = props.speed * Math.sin(props.angle * RADIANS_COEF);
		}
	});

	return ResourceFragment;
});