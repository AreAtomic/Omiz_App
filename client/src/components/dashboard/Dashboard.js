/* Page d'accueil Post connexion */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import axios from 'axios';
import Navbar from './Navbar';
import FormFav from './FormFav';
import '../../css/User.css';
import Lives from '../lives/LivesUser';
import '../../css/Loader.css';

class Dashboard extends Component {
  constructor(props) {
    super();
    this.state = {
      user: '',
      favoris: '',
      isLoading: true,
      error: null,
    };
  }
  componentDidMount() {
    this.setUser();
  }

  //Authentificationd de l'utilisateur
  setUser() {
    axios
      .post('/api/users/me', this.props.auth.user, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) =>{
        //Initilisation des données utilisateurs
        this.setState({
          user: res.data,
          favoris: res.data.favoris,
          isLoading: false,
        })
        const user = res.data;
        localStorage.setItem('user', user);
      }
      )
      .catch((err) => console.log(err));
  }

  // Déconnexion
  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { user, favoris, isLoading, error } = this.state;
    return (
      <div>
        {error ? <p>{error.message}</p> : null}
        {!isLoading ? (
          <div>
            <Navbar src={user.picture} name={user.name} link='/'/>
            <FormFav email={user.email} favoris={favoris} />
          </div>
        ) : (
          <div className='loader'>
            <span>L</span>
            <span>O</span>
            <span>O</span>
            <span>A</span>
            <span>D</span>
            <span>I</span>
            <span>N</span>
            <span>G</span>
          </div>
        )}
      </div>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(Dashboard);
