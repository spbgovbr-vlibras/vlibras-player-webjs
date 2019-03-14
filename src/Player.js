var window = require('window');
var document = window.document;

var assign = require('object-assign');
var inherits = require('inherits');
var path = require('path');

var EventEmitter = require('events').EventEmitter;
var PlayerManagerAdapter = require('./PlayerManagerAdapter.js');
var GlosaTranslator = require('./GlosaTranslator.js');

function Player(options) {
  this.options = assign({
    translator: 'http://35.232.189.139:8080/translate',
    targetPath: 'target',
  }, options);

  this.playerManager = new PlayerManagerAdapter();
  this.translator = new GlosaTranslator(this.options.translator);

  this.glosa = undefined;
  this.loaded = false;
  this.progress = null;
  this.gameContainer = null;
  this.player = null;

  this.playerManager.on('load', () => {
    this.loaded = true;
    this.emit('load');
    this.play();
  });

  this.playerManager.on('progress', (progress) => {
    this.emit('animation:progress', progress);
  });

  this.playerManager.on('stateChange', (isPlaying, isPaused, isLoading) => {
    if (isPaused) {
      this.emit('animation:pause');
    } else if (isPlaying && !isPaused) {
      this.emit('animation:play');
    } else if (!isPlaying && !isLoading) {
      this.emit('animation:end');
    }
  });
}

inherits(Player, EventEmitter);

Player.prototype.translate = function (text) {
  this.emit('translate:start');
  if (this.loaded) this.stop();
  this.translator.translate(text, function (gloss, err) {
    if (err) {
      this.emit('error', 'translation_error');
      this.play(text.toUpperCase());
      return;
    }

    console.log('Translator answer:', gloss);
    this.play(gloss);
    this.emit('translate:end');
  }.bind(this));
};

Player.prototype.play = function (glosa) {
  this.glosa = glosa || this.glosa;
  if (this.glosa !== undefined && this.loaded) {
    this.playerManager.play(this.glosa);
  }
};

Player.prototype.continue = function () {
  this.playerManager.play();
};

Player.prototype.repeat = function () {
  this.play();
};

Player.prototype.pause = function () {
  this.playerManager.pause();
};

Player.prototype.stop = function () {
  this.playerManager.stop();
};

Player.prototype.setSpeed = function (speed) {
  this.playerManager.setSpeed(speed);
};

Player.prototype.toggleSubtitle = function () {
  this.playerManager.toggleSubtitle();
};

Player.prototype.setRegion = function (region) {
  this.playerManager.setRegion(region);
};

Player.prototype.load = function (wrapper) {
  this.gameContainer = document.createElement('div');
  this.gameContainer.setAttribute("id", "gameContainer");
  this.gameContainer.classList.add('emscripten');

  if ('function' == typeof this.options.progress) {
    this.progress = new this.options.progress(wrapper);
  }

  wrapper.appendChild(this.gameContainer);

  this._initializeTarget();
};

Player.prototype._getTargetScript = function () {
  return path.join(this.options.targetPath, 'UnityLoader.js');
};

Player.prototype._initializeTarget = function () {
  const targetSetup = path.join(this.options.targetPath, 'playerweb.json');
  const targetScript = document.createElement('script');

  targetScript.src = this._getTargetScript();
  targetScript.onload = () => {
    this.player = UnityLoader.instantiate("gameContainer", targetSetup);
    this.playerManager.setPlayerReference(this.player);
  };

  document.body.appendChild(targetScript);
};

module.exports = Player;
