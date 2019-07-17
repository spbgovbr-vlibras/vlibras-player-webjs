var window = require('window');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

var GAME_OBJECT = 'PlayerManager';

function PlayerManagerAdapter() {
  if (PlayerManagerAdapter.instance) return PlayerManagerAdapter.instance;

  this.subtitle = true;

  this.on('load', function () {
    this._send('initRandomAnimationsProcess');
  }.bind(this));

  PlayerManagerAdapter.instance = this;
}

inherits(PlayerManagerAdapter, EventEmitter);

PlayerManagerAdapter.prototype.setPlayerReference = function (player) {
  this.player = player;
};

PlayerManagerAdapter.prototype._send = function (method, params) {
  this.player.SendMessage(GAME_OBJECT, method, params);
};

PlayerManagerAdapter.prototype.play = function (glosa) {
  if (glosa) {
    this._send('playNow', glosa);
  } else {
    this._send('setPauseState', 0);
  }
};

PlayerManagerAdapter.prototype.pause = function () {
  this._send('setPauseState', 1);
};

PlayerManagerAdapter.prototype.stop = function () {
  this._send('stopAll');
};

PlayerManagerAdapter.prototype.setSpeed = function (speed) {
  this._send('setSlider', speed);
};

PlayerManagerAdapter.prototype.toggleSubtitle = function () {
  this.subtitle = !this.subtitle;
  this._send('setSubtitlesState', toInt(this.subtitle));
};

PlayerManagerAdapter.prototype.setRegion = function (region) {
  this._send('setRegion', region);
};

PlayerManagerAdapter.prototype.playWellcome = function () {
  this._send('playWellcome');
};

PlayerManagerAdapter.prototype.changeAvatar = function () {
  this._send('Change');
};


PlayerManagerAdapter.prototype.setBaseUrl = function (url) {
  this._send('setBaseUrl', url);
};

window.onLoadPlayer = function () {
  PlayerManagerAdapter.instance.emit('load');
};

window.updateProgress = function (progress) {
  PlayerManagerAdapter.instance.emit('progress', progress);
};

window.onPlayingStateChange = function (
  isPlaying, isPaused, isPlayingIntervalAnimation, isLoading, isRepeatable) {
  PlayerManagerAdapter.instance.emit(
    'stateChange', toBoolean(isPlaying), toBoolean(isPaused), toBoolean(isLoading)
  );
};

window.CounterGloss = function (counter, glosaLenght) {
    PlayerManagerAdapter.instance.emit(
    'CounterGloss', counter, glosaLenght
  );
};

window.FinishWelcome = function (bool) {
    PlayerManagerAdapter.instance.emit(
    'FinishWelcome', bool
  );
};

function toInt(boolean) {
  return !boolean ? 0 : 1;
};

function toBoolean(bool) {
  return bool != 'False';
};

module.exports = PlayerManagerAdapter;
