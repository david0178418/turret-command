define(function(require) {
	"use strict";

	var _ = require('lodash'),
		Phaser = require('phaser'),
		damageComponent = require('components/damage'),
		gunComponent = require('components/gun'),
		laserGunComponent = require('components/laser-gun'),
		targetClosest = require('components/target-closest'),
		instanceManager = require('instance-manager');

	function Turret(props) {
		var game = instanceManager.get('game');
		Phaser.Sprite.call(this, game, props.x, props.y, 'turret');
		this.revive(Turret.HEALTH);
		this.anchor.setTo(0.5, 1);
		this.smoothed = false;
		this.inputEnabled = true;
		this.rangeOutline = game.add.graphics(props.x, props.y);
		//this.rangeOutline.visible = false;
		this.rangeOutline.lineStyle(1, 0xff0000, 0.5);
		this.rangeOutline.drawCircle(0, 0, Turret.RANGE);
		this.rangeOutline.visible = false;
		this.enemyTargets = instanceManager.get('enemyTargets');
		this.initGun({
			cooldown: Turret.COOLDOWN,
			offsetX: 0,
			offsetY: -this.height,
		});
		this.initTargetClosest({
			targetAction: this.fireAt,
			range: Turret.RANGE,
		});

		game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.immovable = true;
		this.events.onKilled.add(function() {
			this.rangeOutline.visible = false;
		}, this);
		this.events.onRevived.add(function() {
			this.rangeOutline.visible = true;
		}, this);
		this.events.onInputOver.add(this.highlight, this);
		this.events.onInputOut.add(this.unhighlight, this);
	}

	Turret.HEALTH = 2;
	Turret.COST = 150;
	Turret.RANGE = 700;
	Turret.COOLDOWN = 800;

	Turret.preload = function(game) {
		game.load.image('turret', 'assets/images/turret.png');
	};

	Turret.prototype = Object.create(Phaser.Sprite.prototype);
	_.extend(Turret.prototype,
		damageComponent,
		gunComponent,
		laserGunComponent,
		targetClosest, {
			constructor: Turret,
			update: function() {
				if(this.isDead()) {
					this.kill();
					return;
				}

				if(this.gunReady()) {
					this.aquireTarget(this.enemyTargets);
				}
			},
			highlight: function() {
				this.rangeOutline.visible = true;
			},
			unhighlight: function() {
				this.rangeOutline.visible = false;
			}
		});

	//Unify this with all the others that use "create"
	Turret.create = function(x, y) {
		var turret,
			turrets = instanceManager.get('turrets');

		turret = turrets.getFirstDead();

		if(!turret) {
			turret = new Turret({x: x, y:y});
			turrets.add(turret);
		} else {
			turret.reset(x, y);
			turret.revive();
		}

		return turret;
	};

	return Turret;
});
