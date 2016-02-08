var React = require('react'),
    History = require('react-router').History,
    LinkedState = require('react-addons-linked-state-mixin'),
    TrackUtil = require('../../util/track_util'),
    ModalActions = require('../../actions/modal_actions'),
    CurrentUserStore = require('../../stores/current_user'),
    ModalSpinner = require('../modal_spinner'),
    FormErrorStore = require('../../stores/form_error'),
    FormErrors = require('../form_errors');

module.exports = React.createClass({
  mixins: [History, LinkedState],

  getInitialState: function () {
    return {
      title: "",
      description: "",
      imageFile: null,
      imageUrl: "",
      submitted: false,
      errorMessages: []
    };
  },

  componentDidMount: function () {
    this.formErrorChange = FormErrorStore.addListener(this._onFormError);
  },

  componentWillUnmount: function () {
    this.formErrorChange.remove();
  },

  render: function () {

    if (this.state.submitted) {
      return <ModalSpinner/>;
    }

    var image;
    if (this.state.imageUrl) {
      image = (<img src={this.state.imageUrl} />);
    }

    return (
      <div className="modal" onClick={this._cancel}>
        <div className="modal-container group" onClick={this._stopPropogation}>
          <h2>Create Track</h2>

          <FormErrors messages={ this.state.errorMessages } />

          <form onSubmit={this._submit} className="track-update-form">
            <div className="form-image">
              {image}
            </div>

            <label htmlFor="track-art">Track Image</label>
            <input id="track-art" type="file" onChange={this._imageUpload} />

            <label htmlFor="title">Title <span>*</span></label>
            <input
              id="title"
              type="text"
              valueLink={this.linkState('title')}>
            </input>

            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              valueLink={this.linkState('description')}>
            </textarea>

            <input
              type="submit"
              className="hidden-submit"
              tabIndex="-1" >
            </input>
          </form>

          <button className="submit" onClick={this._submit}>Save Track</button>
          <button className="cancel" onClick={this._cancel}>Cancel</button>
        </div>
      </div>
    );
  },

  _cancel: function (e) {
    ModalActions.destroyModal();
  },

  _imageUpload: function (e) {
    e.preventDefault();

    var reader = new FileReader();
    var file = e.currentTarget.files[0];

    reader.onloadend = function () {
      this.setState({imageFile: file, imageUrl: reader.result});
    }.bind(this);

    if (file) {
      reader.readAsDataURL(file);
    } else {
      this.setState({imageFile: null, imageUrl: ""});
    }
  },

  _submit: function (e) {
    e.preventDefault();

    this.setState({ submitted: true })

    var formData = new FormData();

    formData.append("track[title]", this.state.title);
    formData.append("track[description]", this.state.description);
    formData.append("track[audio]", this.props.audio);
    if (this.state.imageFile) {
      formData.append("track[track_art]", this.state.imageFile);
    }

    var success = function (trackId) {
      this.history.pushState({}, "/tracks/" + trackId);
    }.bind(this)

    var error = function () {
      this.setState({ submitted: false })
    }.bind(this)

    TrackUtil.createTrack(formData, success, error);
  },

  _onFormError: function () {
    this.setState({ errorMessages: FormErrorStore.all() })
  },

  _stopPropogation: function (e) {
    e.stopPropagation();
  }
});
