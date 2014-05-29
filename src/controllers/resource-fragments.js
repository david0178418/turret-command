define(function(require) {
	"use strict";
	var _ = require('lodash'),
		Phaser = require('phaser'),
		ResourceFragment = require('entities/resource-fragment'),
		instanceManager = require('instance-manager');
	
	function ResourceFragments() {
		this.game = instanceManager.get('game');
		this.resourceFragments = this.game.add.group();
		this.baseInterval = 500;
		this.intervalRange = 2000;
		this.nextSpawn = 2000;
		this.level = 0;
		this.killCount = 0;
		this.speedInterval = 50;
		window.resourceFragments = this.resourceFragments; //debug
	}
	
	ResourceFragments.DIRECTION_ARC = 45;
	ResourceFragments.SPAWN_SPEED = 150;
	
	ResourceFragments.prototype = {
		spawnResourceFragments: function(x, y, value) {
			var resource,
				resourceCount = 1 + _.random(value),
				properties = {
					x: x,
					y: y,
					speed: ResourceFragments.SPAWN_SPEED,
					value: 10
				};
			
			for(var x = 0; x <= resourceCount; x++) {
				properties.angle = _.random(-ResourceFragments.DIRECTION_ARC - 90, ResourceFragments.DIRECTION_ARC - 90);
				resource = this.resourceFragments.getFirstDead();
					
				if(!resource) {
					resource = new ResourceFragment(properties);

					this.resourceFragments.add(resource);
				} else {
					resource.spawn(properties);
				}
			}
		},
	};
	
	ResourceFragments.preload = function(game) {
		ResourceFragment.preload(game);
	};

	return ResourceFragments;
});