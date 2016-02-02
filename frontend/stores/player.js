var AppDispatcher = require('../dispatcher/dispatcher'),
    Store = require('flux/utils').Store,
    PlayerConstants = require('../constants/player_constants');

//hash with linked list would be better...
var _wavesurfers = [],
    _currentWavesurfer = null,
    PlayerStore = new Store(AppDispatcher);

var add = function (wavesurfer) {
  _wavesurfers.push(wavesurfer);
};

var findWavesurfer = function (trackId) {
  return _wavesurfers.find(function (wavesurfer) {
    return wavesurfer.trackId === trackId;
  });
};

var remove = function (trackId) {
  var wavesurfer = findWavesurfer(trackId);

  if (wavesurfer) {
    var index = _wavesurfers.indexOf(wavesurfer);

    _wavesurfers.splice(index, 1);
  }
};

var play = function (trackId) {
  if (!_currentWavesurfer) {
    _currentWavesurfer = findWavesurfer(trackId);
  } else if (_currentWavesurfer && _currentWavesurfer.trackId !== trackId) {
    _currentWavesurfer.wavesurfer.pause();
    _currentWavesurfer = findWavesurfer(trackId);
  }

  _currentWavesurfer.wavesurfer.play();
};

var pause = function () {
  _currentWavesurfer.wavesurfer.pause();
};

var destroy = function () {
  _currentWavesurfer.wavesurfer.stop()

  var index = _wavesurfers.indexOf(_currentWavesurfer);
  _wavesurfers.splice(index, 1);
};

PlayerStore.__onDispatch = function (payload) {
  switch (payload.actionType) {
    case PlayerConstants.RECEIVED:
      add(payload.wavesurfer);
      break;
    case PlayerConstants.REMOVED:
      remove(payload.trackId);
      break;
    case PlayerConstants.PLAYED:
      play(payload.trackId);
      PlayerStore.__emitChange();
      break;
    case PlayerConstants.PAUSED:
      pause();
      PlayerStore.__emitChange();
      break;
    case PlayerConstants.DESTROYED:
      if (_currentWavesurfer.trackId === payload.trackId) {
        destroy();
      }
      PlayerStore.__emitChange();
      break;
  }
};

PlayerStore.trackId = function () {
  return _currentWavesurfer && _currentWavesurfer.trackId;
};

PlayerStore.isPlaying = function () {
  return _currentWavesurfer && _currentWavesurfer.wavesurfer.isPlaying();
};

module.exports = PlayerStore;
