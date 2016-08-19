define(function(require) {
	"use strict";
	var _ = require('lodash');
	var Phaser = require('phaser');
	var instanceManager = require('instance-manager');
	var damageComponent = require('components/damage');

	var RADIANS_COEF = Math.PI / 180;
	var MAX_ANGULAR_VELOCITY = 200;

	function Meteor(props) {
		var game = instanceManager.get('game');
		var type = Math.random() < .5 ? '1' : '2';

		Phaser.Sprite.call(this, game, props.x, props.y, 'meteor'+type);
		this.scored = false;
		this.smoothed = false;
		this.onKill = props.onKill || function() {};
		this.revive(Meteor.TOUGHNESS);
		this.anchor.setTo(0.5, 0.5);
		game.add.existing(this);

		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.collideWorldBounds = false;

		this.resourceFragments = instanceManager.get('resourceFragments');
		this.startFall(props);
		this.body.angularVelocity = Math.random() * ( (MAX_ANGULAR_VELOCITY / 2) -  MAX_ANGULAR_VELOCITY);
		this.sounds = {
			explode: game.add.sound('explode1'),
		};
	}

	Meteor.TOUGHNESS = 7;

	Meteor.preload = function(game) {
		game.load.image('meteor1', '/assets/images/meteor1.png');
		game.load.image('meteor2', '/assets/images/meteor2.png');
		game.load.audio('hit1', '/assets/audio/hit1.ogg');
		game.load.audio('explode1', '/assets/audio/explode1.ogg');
	};

	Meteor.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(Meteor.prototype, damageComponent, {
		constructor: Meteor,
		update: function(delta) {
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
