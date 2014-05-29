define(function(require) {
	"use strict";
	var CONFIG = require('config'),
		Phaser = require('phaser'),
		States = require('states'),
		Meteors = require('controllers/meteors'),
		Hero = require('entities/hero'),
		Building = require('entities/building'),
		Beam = require('entities/beam'),
		Ship = require('entities/ship'),
		Hud = require('entities/hud'),
		instanceManager = require('instance-manager'),
		resourceFragments,
		game = instanceManager.get('game');
	
	States.Play = 'play';
	game.state.add(States.Play, {
		preload: function(game) {
			Hero.preload(game);
			Building.preload(game);
			Meteors.preload(game);
			Hud.preload(game);
			Beam.preload(game);
		},
		create: function(game) {
			resourceFragments = instanceManager.get('resourceFragments');
			game.physics.startSystem(Phaser.Physics.ARCADE);
			game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
			game.scale.setShowAll();
			game.scale.pageAlignHorizontally = true;
			game.scale.pageAlignVeritcally = true;
			game.scale.refresh();

			window.addEventListener('resize', function() {
				game.scale.setShowAll();
				game.scale.refresh();
			});

			game.world.setBounds(0, 0, CONFIG.stage.width, CONFIG.stage.height);
			
			Building.create({
				x: 100,
				y: game.world.height
			});
		
			Building.create({
				x: game.world.width / 2,
				y: game.world.height
			});
		
			Building.create({
				x: game.world.width - 100,
				y: game.world.height
			});
			
			this.meteorController = instanceManager.get('meteorController');
			this.shipController = instanceManager.get('shipController');
			this.meteors = instanceManager.get('meteors');
			this.hero = instanceManager.get('hero');
			this.turrets = instanceManager.get('turrets');
			this.buildings = instanceManager.get('buildings')
			this.hud = instanceManager.get('hud');
			this.enemyTargets = instanceManager.get('enemyTargets');
			game.stage.backgroundColor = '#333';
			
			game.camera.follow(this.hero);
		},
		update: function(game) {
			var meteors = this.meteors;
			
			//TODO Unify all this crazy
			game.physics.arcade.collide(this.hero, meteors, this.collideHeroMeteor, null, this);
			game.physics.arcade.collide(this.turrets, meteors, this.collideTurretMeteor, null, this);
			game.physics.arcade.collide(meteors, this.buildings, this.collideMeteorBuilding, null, this);
			game.physics.arcade.collide(this.hero, resourceFragments.resourceFragments, this.collideHeroResource, null, this);
			
			this.meteorController.update(game);
			this.shipController.update(game);
			this.hud.update(game);
		},
		paused: function() {
		},
		collideTurretMeteor: function(turret, meteor) {
			turret.damage(1);
			meteor.explode();
		},
		collideHeroMeteor: function(hero, meteor) {
			var meteorTouching;
			
			hero.damage(1);
			hero.stun();
			meteor.explode();
		},
		collideMeteorBuilding: function(meteor, building) {
			meteor.explode();
			building.damage(1);
		},
		collideHeroResource: function(hero, resource) {
			hero.addPower(resource.value);
			resource.kill();
		}
	});
});