define(function(require) {
	"use strict";
	var CONFIG = require('config'),
		Phaser = require('phaser'),
		States = require('states'),
		Meteors = require('controllers/meteors'),
		Hero = require('entities/hero'),
		Buildings = require('controllers/buildings'),
		Hud = require('entities/hud'),
		resourceFragments = require('singletons/resource-fragments'),
		game = require('singletons/game');
	
	States.Play = 'play';
	game.state.add(States.Play, {
		hero: null,
		preload: function(game) {
			Hero.preload(game);
			Buildings.preload(game);
			Meteors.preload(game);
			Hud.preload(game);
		},
		create: function(game) {
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
			
			this.meteorController = new Meteors(game);
			window.buildings = this.buildingController = new Buildings(game);
			this.hero = new Hero({x: CONFIG.stage.width/2, y: CONFIG.stage.height}, game);
			this.turrets = this.hero.turrets;
			this.hud = new Hud(game, this.hero, this.meteorController);
			game.add.existing(this.hero);
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
			
			game.physics.arcade.collide(this.hero, this.meteorController.meteors, this.collideHeroMeteor, null, this);
			game.physics.arcade.collide(this.turrets, this.meteorController.meteors, this.collideTurretMeteor, null, this);
			game.physics.arcade.collide(meteors, this.buildingController.cities, this.collideMeteorBuilding, null, this);
			game.physics.arcade.collide(this.hero, resourceFragments.resourceFragments, this.collideHeroResource, null, this);

			//this.hero.update(game);	??Why is this updating
			this.meteorController.update(game);
			this.hud.update(game);
		},
		paused: function() {
		},
		collideTurretMeteor: function(turret, meteorB) {
			turret.damage(1);
			if(turret.isDead()) {
				turret.kill();
			}
			meteorB.kill();
		},
		collideHeroMeteor: function(hero, meteor) {
			var meteorTouching;
			
			hero.damage(1);
			hero.stun();
			meteor.kill();
		},
		collideMeteorBuilding: function(meteor, building) {
			meteor.kill();
			building.damage(1);
		},
		collideHeroResource: function(hero, resource) {
			hero.addPower(resource.value);
			resource.kill();
		}
	});
});