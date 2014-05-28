define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		Meteor = require('entities/meteor'),
		instanceManager = require('instance-manager');
	
	function Meteors() {
		this.game = instanceManager.get('game');
		this.meteors = this.game.add.group();
		this.baseInterval = 500;
		this.intervalRange = 2000;
		this.nextSpawn = 2000;
		this.level = 0;
		this.killCount = 0;
		this.speedInterval = 50;
		window.meteors = this.meteors; //debug
	}
	
	Meteors.DIRECTION_ARC = 60;	//Arc off straight down in either direction that the meteor can begin motion
	Meteors.BASE_SPEED = 100;
	Meteors.SPAWN_HEIGHT = -50;

	Meteors.prototype = {
		update: function() {
			this.nextSpawn -= this.game.time.elapsed;

			if(this.nextSpawn < 0) {
				this.spawnMeteor(this.game);

				this.nextSpawn = this.baseInterval + _.random(this.intervalRange);
			}
		},
		
		incrementKills: function() {
			this.killCount++;
		},

		spawnMeteor: function() {
			var meteor = this.meteors.getFirstDead(),
				properties = {
					x: _.random(100, this.game.world.width - 100),
					y: Meteors.SPAWN_HEIGHT,
					angle: _.random(-Meteors.DIRECTION_ARC + 90, Meteors.DIRECTION_ARC + 90),
					speed: Meteors.BASE_SPEED + _.random(0, this.level*this.speedInterval),
					onKill: _.bind(this.incrementKills, this)
				};
			
			if(!meteor) {
				meteor = new Meteor(properties, this.game);
				
				this.meteors.add(meteor);
			} else {
				meteor.startFall(properties);
			}
		},
	};
	
	Meteors.preload = function(game) {
		game.load.spritesheet('meteor', '/assets/images/meteor.png', 50, 50);
		game.load.audio('hit1', '/assets/audio/hit1.ogg');
		game.load.audio('explode1', '/assets/audio/explode1.ogg');
		Meteor.preload(game);
	};

	return Meteors;
});