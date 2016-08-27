define(function(require) {
	"use strict";

	var _ = require('lodash');
	var Phaser = require('phaser');
	var instanceManager = require('instance-manager');
	var BLOCK_COLORS = require('constants').BLOCK_COLORS;

	var MAX_ANGULAR_VELOCITY = 200;
	var RADIANS_COEF = Math.PI / 180;

	function ResourceFragment(props) {
		var game = instanceManager.get('game');
		var resourceNumber = (BLOCK_COLORS.length * Math.random()) | 0;
		Phaser.Sprite.call(this, game, props.x, props.y, 'plate-round-trans-'+(BLOCK_COLORS[resourceNumber]));

		this.anchor.setTo(0.5, 1);
		this.revive();
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.smoothed = false;
		this.body.collideWorldBounds = true;
		this.body.gravity.y = 400;
		this.spawn(props);
		game.add.existing(this);
	}

	ResourceFragment.LIFETIME = 4000;
	ResourceFragment.preload = function(game) {
	};

	ResourceFragment.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(ResourceFragment.prototype, {
		constructor: ResourceFragment,
		update: function() {

			if(this.y >= this.game.world.height - this.height) {
				this.body.velocity.x = 0;
				this.body.angularVelocity = 0;
				this.angle = 0;
				this.body.allowGravity = false;
				this.y = this.game.world.height; // use longer side since they rotate and can land on any side
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
			this.body.allowGravity = true;
			this.body.velocity.x = props.speed * Math.cos(props.angle * RADIANS_COEF);
			this.body.velocity.y = props.speed * Math.sin(props.angle * RADIANS_COEF);
			this.body.angularVelocity = Math.random() * ( (MAX_ANGULAR_VELOCITY / 2) -  MAX_ANGULAR_VELOCITY);
		}
	});

	return ResourceFragment;
});
