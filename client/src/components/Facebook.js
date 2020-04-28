import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUserFB } from '../actions/authActions';

const history = window.history;

class Facebook extends Component {
  constructor(props) {
    super();
    this.state = {
      isLogged: false,
      userID: '',
      name: '',
      email: '',
      picture: '',
    };
  }
  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      history.pushState("Login", '/login');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/dashboard'); // push user to dashboard when they login
    }
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  componentClicked = () => console.log('clicked');

  responseFacebook = (response) => {
    this.setState({
      isLogged: true,
      userID: response.userID,
      name: response.name,
      email: response.email,
      picture: response.picture.data.url,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const userData = this.state;

    this.props.loginUserFB(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
  };

  render() {
    let fbContent;
    if (this.state.isLogged) {
      fbContent = (
        <form onSubmit={this.onSubmit} className='facebook-logged-info'>
          <img src={this.state.picture} alt='User profile picture' />
          <h3>Bienvenue {this.state.name}</h3>
          <button type='submit' className='button yellow'>Continuer</button>
        </form>
      );
    } else {
      fbContent = (
        <FacebookLogin
          appId='2526667984253913'
          autoLoad={false}
          fields='name, email, picture'
          onClick={this.componentClicked}
          callback={this.responseFacebook}
          cssClass='facebook-login'
          textButton={<span>f</span>}
        />
      );
    }
    return <div>{fbContent}</div>;
  }
}

Facebook.propTypes = {
  loginUserFB: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUserFB })(Facebook);
