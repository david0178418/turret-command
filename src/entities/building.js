define(function(require) {
	"use strict";

	var _ = require('lodash'),
		Phaser = require('phaser'),
		damageComponent = require('components/damage');
	
	function Building(props, game) {
		Phaser.Sprite.call(this, game, props.x, props.y, 'city');
		// XXX TEMP SIZE FOR PLACEHOLDER
		this.width = 50;
		this.height = 200;
		// END
		
		this.revive(Building.HIT_POINTS);
		this.anchor.setTo(0.5, 1);
		
		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.immovable = true;
	}
	
	Building.HIT_POINTS = 4;
	Building.preload = function(game) {
	};
	
	Building.prototype = Object.create(Phaser.Sprite.prototype);
	
	_.extend(Building.prototype, damageComponent, {
		constructor: Building,
		update: function() {
			if(!this.health) {
				this.kill();
				return;
			}
			
			this.height = this.health * 50;
		},
	});

	return Building;
});