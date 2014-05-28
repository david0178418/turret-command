define(function(require) {
	"use strict";
	//TODO Need better place to organize since not really an entity.  Maybe "interface" folder?
	var _ = require('lodash'),
		Phaser = require('phaser'),
		instanceManager = require('instance-manager');

	function Hud() {
		this.game = instanceManager.get('game');
		this.hero  = instanceManager.get('hero');
		this.meteorController = instanceManager.get('meteors');
		
		this.currentScore = this.meteorController.killCount;
		this.currentHealth = this.hero.health;
		this.currentPower = this.hero.power;
		
		this.scoreMsg = this.game.add.text(20, 20, 'Score: '+this.meteorController.killCount, {
			font: '30px Arial',
			fill: '#ff0044',
			align: 'left'
		});
		
		this.healthMsg = this.game.add.text(20, 60, 'Health: '+this.hero.health, {
			font: '30px Arial',
			fill: '#ff0044',
			align: 'left'
		});
		this.powerMsg = this.game.add.text(20, 100, 'Power: '+this.hero.power, {
			font: '30px Arial',
			fill: '#ff0044',
			align: 'left'
		});
		
		this.scoreMsg.fixedToCamera = true;
		this.healthMsg.fixedToCamera = true;
		this.powerMsg.fixedToCamera = true;
		
		window.hud = this;	//debug
	}

	Hud.prototype = {
		update: function() {
			if(this.currentScore !== this.meteorController.killCount) {
				this.scoreMsg.text = 'Score: '+this.meteorController.killCount;
				this.currentScore = this.meteorController.killCount;
			}
			
			if(this.currentHealth !== this.hero.health) {
				this.healthMsg.text = 'Health: '+this.hero.health;
				this.currentHealth = this.hero.health;
			}
			
			if(this.currentPower !== this.hero.power) {
				this.powerMsg.text = 'Power: '+this.hero.power;
				this.currentPower = this.hero.power;
			}
		}
	};
	
	Hud.preload = function(game) {
		
	};

	return Hud;
});