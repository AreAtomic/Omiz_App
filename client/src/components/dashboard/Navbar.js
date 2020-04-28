import React, { Component } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { logoutUser } from '../../actions/authActions';

const history = window.history;

class Navbar extends Component {
  constructor(props) {
    super();
    this.onLogoutClick = this.onLogoutClick.bind(this);
  }
  onLogoutClick = (e) => {
    if(this.props.link == '/'){
      logoutUser();
    }
    history.pushState(this.props.link.toString(), this.props.link);
  };
  render() {
    return (
      <div className='header'>
        <img
          src={this.props.src}
          alt={this.props.name}
          className='user-picture'
        />
        <p className='user-name'>{this.props.name}</p>
        <Link
          onClick={this.onLogoutClick}
          className='button logout'
          to={this.props.link}
        >
          <IoMdArrowRoundBack />
        </Link>
      </div>
    );
  }
}

export default Navbar;
