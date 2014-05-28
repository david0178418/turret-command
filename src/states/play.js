define(function(require) {
	"use strict";
	var CONFIG = require('config'),
		Phaser = require('phaser'),
		States = require('states'),
		Meteors = require('controllers/meteors'),
		Hero = require('entities/hero'),
		Buildings = require('controllers/buildings'),
		Beam = require('entities/beam'),
		Hud = require('entities/hud'),
		injector = require('injector'),
		resourceFragments,
		game = injector.get('game');
	
	States.Play = 'play';
	game.state.add(States.Play, {
		preload: function(game) {
			Hero.preload(game);
			Buildings.preload(game);
			Meteors.preload(game);
			Hud.preload(game);
			Beam.preload(game);
		},
		create: function(game) {
			resourceFragments = injector.get('resourceFragments');
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
			
			this.meteorController = injector.get('meteors');
			this.buildingController = new Buildings(game);
			
			this.hero = injector.get('hero');
			this.turrets = injector.get('turrets');
			this.hud = injector.get('hud');
			game.stage.backgroundColor = '#333';
			
			game.camera.follow(this.hero);
		},
		update: function(game) {
			var meteors = this.meteorController.meteors;
			// TODO Unevil-ify this n^2 check
			this.turrets.forEachAlive(function(turret) {
				turret.update();
				turret.affect(meteors);
			}, this);
			
			game.physics.arcade.collide(this.hero, meteors, this.collideHeroMeteor, null, this);
			game.physics.arcade.collide(this.turrets, meteors, this.collideTurretMeteor, null, this);
			game.physics.arcade.collide(meteors, this.buildingController.cities, this.collideMeteorBuilding, null, this);
			game.physics.arcade.collide(this.hero, resourceFragments.resourceFragments, this.collideHeroResource, null, this);

			//this.hero.update(game);	??Why is this updating
			this.meteorController.update(game);
			this.hud.update(game);
		},
		paused: function() {
		},
		collideTurretMeteor: function(turret, meteor) {
			turret.damage(1);
			if(turret.isDead()) {
				turret.kill();
			}
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