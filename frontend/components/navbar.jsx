var React = require('react'),
    Link = require('react-router').Link,
    History = require('react-router').History,
    SessionsApiUtil = require('../util/sessions_api_util'),
    CurrentUserStore = require('../stores/current_user');

module.exports = React.createClass({
  mixins: [History],

  render: function () {
    var currentUser = CurrentUserStore.currentUser()

    return (
      <header className="navbar">
        <nav className="group">
          <Link to="/" className="logo">
            <div className="sheep"></div>
            <div className="sheep clone"></div>
          </Link>
          <Link to="/" className="explore">Explore</Link>

          <div className="navbar-right group">
            <Link to={"/users/" + currentUser.id} className="current-user-profile">
              <img className="navbar-thumb" src={currentUser.profile_image_url}/>
              {currentUser.username}
            </Link>
            <a className="logout" href="#" onClick={this._logout}>Sign Out</a>
          </div>
        </nav>
      </header>
    );
  },

  _logout: function (e) {
    e.preventDefault();
    SessionsApiUtil.logout(function () {
      this.history.pushState({}, "/login");
    }.bind(this));
  }

});
