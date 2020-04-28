/* Composant d'ajout de Live */

import React, { Component } from 'react';
import Navbar from './Navbar';
import FormLive from './FormLive';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class CreateLive extends Component {
  constructor(props) {
    super();
    let user = props.auth.user;
    this.state = {
      user: user,
      date: Date.now(),
    };
  }
  componentDidMount() {
    this.setUser();
  }

  //Authentification de l'utilisateur
  setUser() {
    axios
      .post('/api/users/me', this.props.auth.user, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        //Initialisation des données de l'utilisateur
        this.setState({
          user: res.data,
          favoris: res.data.favoris,
          isLoading: false,
        });
        const user = res.data;
        localStorage.setItem('user', user);
      })
      .catch((err) => console.log(err));
  }

  render() {
    const user = this.state.user;
    return (
      <div className='App'>
        <Navbar src={user.picture} name={user.name} link='/dashboard' />
        <FormLive email={this.state.user.email} name={this.state.user.name}/>
      </div>
    );
  }
}

CreateLive.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(CreateLive);
