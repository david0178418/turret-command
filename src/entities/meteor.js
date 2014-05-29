define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		instanceManager = require('instance-manager'),
		damageComponent = require('components/damage'),
		RADIANS_COEF = Math.PI / 180;
	
	function Meteor(props) {
		var game = instanceManager.get('game');
		
		Phaser.Sprite.call(this, game, props.x, props.y, 'meteor');
		// XXX TEMP SIZE FOR PLACEHOLDER
		this.width = 75;
		this.height = 75;
		// END
		
		this.scored = false;
		this.onKill = props.onKill || function() {};
		this.revive(Meteor.TOUGHNESS);
		this.anchor.setTo(0.5, 0.5);
		game.add.existing(this);
		
		game.physics.enable(this, Phaser.Physics.ARCADE);

		this.body.allowRotation = false;
		this.body.collideWorldBounds = false;
		
		this.resourceFragments = instanceManager.get('resourceFragments');
		this.startFall(props);
		
		this.sounds = {
			explode: game.add.sound('explode1'),
		};
	}
	
	Meteor.TOUGHNESS = 7;
	
	Meteor.preload = function(game) {
		game.load.spritesheet('meteor', '/assets/images/meteor.png', 50, 50);
		game.load.audio('hit1', '/assets/audio/hit1.ogg');
		game.load.audio('explode1', '/assets/audio/explode1.ogg');
	};
	
	Meteor.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(Meteor.prototype, damageComponent, {
		constructor: Meteor,
		update: function() {
			if(!this.alive) {
				return;
			}
			
			if(this.isDead()) {
				this.explode();
				this.resourceFragments.spawnResourceFragments(this.x, this.y, 5);
				return;
			}
			if(this.y > this.game.world.height - (this.height / 2)) {
				this.explode();
			}
		},
		explode: function() {
			this.kill();
			this.sounds.explode.play();
		},
		startFall: function(props) {
			this.events.onKilled.addOnce(this.onKill);
			this.scored = false;
			this.reset(props.x, props.y);
			this.health = Meteor.TOUGHNESS;
			this.body.velocity.x = props.speed * Math.cos(props.angle * RADIANS_COEF);
			this.body.velocity.y = props.speed * Math.sin(props.angle * RADIANS_COEF);
		}
	});

	return Meteor;
});