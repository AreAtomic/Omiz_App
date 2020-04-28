/* Page d'Accueil */

import React from 'react';
import { mount_animations } from '../utils/view';
import { Link } from 'react-router-dom';
import Logo from './Logo';

class Splash extends React.Component {
  constructor(props) {
    super();
    this.container = React.createRef();
    this.state = {
      out: false,
    };
  }

  componentDidMount() {
    mount_animations(this.container.current);
  }

  disappear() {}

  render() {
    return (
      <div id='anim' ref={this.container}>
        <div className='cadre'></div>
        <div id='hero'>
          <Logo />
          <h2>
            <span id='acc1'>Tout en live,</span> <br />
            <span id='acc2'>depuis chez vous.</span>
          </h2>
          <div className='button start'>
            <Link to='/login'>Connexion</Link>
          </div>
          <div className='button first'>
            <Link to='/register'>S'inscrire</Link>
          </div>
        </div>
        <div className='button first absolute'>
          <Link to='/lives'>Connexion sans inscription</Link>
        </div>
      </div>
    );
  }
}

export default Splash;
