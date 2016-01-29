var React = require('react'),
    Link = require('react-router').Link,
    ApiUtil = require('../../util/api_util'),
    ModalActions = require('../../actions/modal_actions'),
    UpdateTrack = require('./update'),
    AudioActions = require('../../actions/audio_actions');

module.exports = React.createClass({
  // delete buttons should close on any click outside the dialog box - dialog store
  getInitialState: function () {
    return ({ deleting: false });
  },

  render: function () {
    var track = this.props.track;

    var deleteClass = "popup";
    if (this.state.deleting) {
      deleteClass = "popup active";
    }

    return (
      <li className="track group">
        <figure className="track-image">
          <img src={track.image_url}/>
        </figure>

        <section className="track-detail-container">

          <div className="group">
            <div className="play-button" onClick={this._playTrack}>
              <div className="play-arrow"></div>
            </div>

            <div className="track-naming">
              <Link className="track-username"
                    to={"/users/" + track.user_id}>{track.username}
              </Link>
              <p>{track.title}</p>
            </div>
          </div>

          <div className="track-buttons">
            <button onClick={this._onUpdate}>Edit</button>
            <button onClick={this._onDelete}>Delete</button>
            <div className={deleteClass}>
              <p>Are you sure you want to permanently delete this track?</p>
              <button onClick={this._cancelDelete}>Cancel</button>
              <button onClick={this._reallyDelete}>Delete</button>
              <div className="popup-arrow"></div>
            </div>
          </div>

        </section>
      </li>
    );
  },

  _playTrack: function (e) {
    e.preventDefault()
    AudioActions.play(this.props.track.audio_url)
  },

  _onUpdate: function (e) {
    var modal = <UpdateTrack trackId={this.props.track.id} />;
    ModalActions.receiveModal(modal);
  },

  _onDelete: function (e) {
    this.setState({ deleting: true });
  },

  _cancelDelete: function (e) {
    this.setState({ deleting: false });
  },

  _reallyDelete: function (e) {
    ApiUtil.destroyTrack(this.props.track.id);
  }

});
