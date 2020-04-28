import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions';
import classnames from 'classnames';
import Facebook from '../Facebook';

import Logo from '../Logo';
localStorage.clear();

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {},
    };
  }
  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
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

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password,
    };

    this.props.loginUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
  };

  render() {
    const { errors } = this.state;
    return (
      <div className='container'>
        <Link to='/' className='button-acceuil'>
          <Logo />
        </Link>
        <form noValidate onSubmit={this.onSubmit} className='formulaire'>
          <div className='input-field'>
            <span className='red-text'>
              {errors.email}
              {errors.emailnotfound}
            </span>
            <input
              onChange={this.onChange}
              value={this.state.email}
              error={errors.email}
              id='email'
              type='email'
              className={classnames('', {
                invalid: errors.email || errors.emailnotfound,
              })}
            />
            <label htmlFor='email'>Email</label>
          </div>
          <div className='input-field'>
            <span className='red-text'>
              {errors.password}
              {errors.passwordincorrect}
            </span>
            <input
              onChange={this.onChange}
              value={this.state.password}
              error={errors.password}
              id='password'
              type='password'
              className={classnames('', {
                invalid: errors.password || errors.passwordincorrect,
              })}
            />
            <label htmlFor='password'>Password</label>
          </div>
          <div className='row-button'>
            <button className='button transparent' type=''>
              S'inscrire
            </button>
            <button className='button yellow' type='submit'>
              Connexion
            </button>
          </div>
        </form>
        <div className='social-connexion'>
          <h3>Connecte tes réseaux sociaux</h3>
          <Facebook />
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUser })(Login);
