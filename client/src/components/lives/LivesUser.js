/* Page de lives lorsque l'utilisateur est connecté */

import React from 'react';
import axios from 'axios';

// Composants externe
import WaveLoader from '../WaveLoader';
import Explorer from '../Explorer';
import Navbar from '../dashboard/Navbar';

// Icones
import { IoMdPlay } from 'react-icons/io';
import Logo from '../Logo';

// Redux properties
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';

class Lives extends React.Component {
  constructor(props) {
    super();
    this.twitch_banner =
      'https://blog.twitch.tv/assets/uploads/generic-email-header-1.jpg';
    this.facebook_banner = 'https://aureliensebe.com/images/facebook.jpg';
    this.instagram_banner = 'https://aureliensebe.com/images/instagram.png';
    this.youtube_banner = 'https://aureliensebe.com/images/youtube.jpg';
    this.zoom_banner = 'https://aureliensebe.com/images/szoom.png';
    let lives = [];
    let otherlives = [];
    let user = '';
    this.state = {
      user: user,
      lives: lives,
      livesNotTwitch: otherlives,
      oldLives: [],
      loaded: -1,
      search_value: '',
      favoris: [],
    };
    this.handle_search = this.handle_search.bind(this);
    this.get_streams = this.get_streams.bind(this);
    this.get_user_streams = this.get_user_streams.bind(this);
    this.get_old_lives = this.get_old_lives.bind(this);
  }

  componentDidMount() {
    this.setUser();
    axios.get('http://localhost:5000/api/lives').then(({ data }) => {
      this.setState({
        lives: data,
        loaded: 0,
      });
      setTimeout(() => {
        this.setState({
          loaded: 1,
        });
      }, 1500);
    });
    axios.get('http://localhost:5000/api/lives/user').then(({ data }) => {
      let lives = data;
      let oldLives = this.state.oldLives;
      let newlive = [];
      let dates = new Date(Date.now());
      let day = dates.getDate() - 2;
      dates.setDate(day);
      dates = dates.toISOString();
      let date = '';
      for (var i = 0; i < dates.length; i++) {
        if (dates[i] == '-') {
          date += ':';
        } else {
          date += dates[i];
        }
      }
      lives.map((l) => {
        if (
          l.created_at.split('T')[0].split(':')[2] <=
          date.split('T')[0].split(':')[2]
        ) {
          oldLives.push(l);
        } else if (
          l.created_at.split('T')[0].split(':')[2] >
          date.split('T')[0].split(':')[2]
        ) {
          newlive.push(l);
        }
      });
      this.setState({
        livesNotTwitch: newlive,
        oldLives: oldLives,
        loaded: 0,
      });
      setTimeout(() => {
        this.setState({
          loaded: 1,
        });
      }, 1500);
    });
    console.log(this.state);
  }

  setUser() {
    axios
      .post('/api/users/me', this.props.auth.user, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        this.setState({ user: res.data, favoris: res.data.favoris });
        console.log(this.state);
      })
      .catch((err) => console.log(err));
  }

  handle_search(event) {
    this.setState({ search_value: event.target.value });
  }

  get_streams() {
    if (this.state.search_value !== '') {
      let value = this.state.search_value.toLowerCase();
      return this.state.lives.filter((live) => {
        return (
          live.channel.status.toLowerCase().includes(value) ||
          live.channel.description.toLowerCase().includes(value) ||
          live.channel.display_name.toLowerCase().includes(value) ||
          live.game.toLowerCase().includes(value) ||
          live.stream_type.toLowerCase().includes(value)
        );
      });
    } else if (this.state.favoris !== []) {
      let values = [];
      for (var j = 0; j < this.state.favoris.length; j++) {
        values.push(this.state.favoris[j].toLowerCase());
      }
      return this.state.lives.filter((live) => {
        return (
          live.channel.status.toLowerCase().includes(values[0]) ||
          live.channel.description.toLowerCase().includes(values[0]) ||
          live.channel.display_name.toLowerCase().includes(values[0]) ||
          live.game.toLowerCase().includes(values[0]) ||
          live.stream_type.toLowerCase().includes(values[0]) ||
          live.channel.status.toLowerCase().includes(values[1]) ||
          live.channel.description.toLowerCase().includes(values[1]) ||
          live.channel.display_name.toLowerCase().includes(values[1]) ||
          live.game.toLowerCase().includes(values[1]) ||
          live.stream_type.toLowerCase().includes(values[1])
        );
      });
    } else {
      return this.state.lives;
    }
  }

  get_user_streams() {
    if (this.state.search_value !== '') {
      let value = this.state.search_value.toLowerCase();
      return this.state.livesNotTwitch.filter((live) => {
        return (
          live.nom.toLowerCase().includes(value) ||
          live.game.toLowerCase().includes(value) ||
          live.plateforme.toLowerCase().includes(value)
        );
      });
    } else if (this.state.favoris !== []) {
      let values = [];
      for (var j = 0; j < this.state.favoris.length; j++) {
        values.push(this.state.favoris[j].toLowerCase());
      }
      return this.state.livesNotTwitch.filter((live) => {
        return (
          live.nom.toLowerCase().includes(values[0]) ||
          live.game.toLowerCase().includes(values[0]) ||
          live.plateforme.toLowerCase().includes(values[0]) ||
          live.nom.toLowerCase().includes(values[1]) ||
          live.game.toLowerCase().includes(values[1]) ||
          live.plateforme.toLowerCase().includes(values[1])
        );
      });
    } else {
      return this.state.livesNotTwitch;
    }
  }

  get_old_lives() {
    if (this.state.search_value !== '') {
      let value = this.state.search_value.toLowerCase();
      return this.state.oldLives.filter((live) => {
        return (
          live.nom.toLowerCase().includes(value) ||
          live.game.toLowerCase().includes(value) ||
          live.plateforme.toLowerCase().includes(value)
        );
      });
    } else {
      return this.state.oldLives;
    }
  }

  render() {
    const user = this.state.user;
    const favoris = this.state.favoris;
    return (
      <div id='main'>
        <Navbar src={user.picture} name={user.name} link='/dashboard' />
        <div className='navbar-wrapper'>
          <Logo />
          <div className='navbar-container'>
            <div className='search-container'>
              <input
                className='search_input'
                type='text'
                placeholder='Rechercher'
                value={this.state.search_value}
                onChange={this.handle_search}
              ></input>
            </div>
          </div>
        </div>
        <Explorer />
        {this.state.loaded < 1 && (
          <WaveLoader className={this.state.loaded === 0 ? ' out ' : ' '} />
        )}
        <h3>Pour toi</h3>
        <div
          className={
            ' lives-grid ' + (this.state.loaded === 1 ? ' loaded ' : ' hidden ')
          }
        >
          {this.state &&
            this.state.lives &&
            this.get_user_streams().map((l) => {
              let banner = '';
              if (l.plateforme == 'Facebook') {
                banner = this.facebook_banner;
              }
              if (l.plateforme == 'Instagram') {
                banner = this.instagram_banner;
              }
              if (l.plateforme == 'Youtube') {
                banner = this.youtube_banner;
              }
              if (l.plateforme == 'Zoom') {
                banner = this.facebook_banner;
              }
              if (l.plateforme == 'Twitch') {
                banner = this.twitch_banner;
              }
              return (
                <div className='live-element' key={l._id}>
                  <div className='card-live'>
                    <div className='banner'>
                      {' '}
                      <img alt='banner' src={banner}></img>{' '}
                    </div>
                    <div className='logo pulse'>
                      {' '}
                      <img alt='logo' src={Logo}></img>{' '}
                    </div>

                    <div className='infos'>
                      <div className='name'> {l.email.split('@')[0]} </div>
                      <div className='game'>{l.game}</div>
                      <div className='hour'>
                        {l.created_at.substring(11, 13)} h{l.url}
                      </div>
                      <a href={l.lien} target='_blank'>
                        <div className='play'>
                          <div className='round-button'>
                            <IoMdPlay />
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div
          className={
            ' lives-grid ' + (this.state.loaded === 1 ? ' loaded ' : ' hidden ')
          }
        >
          {this.state &&
            this.state.livesNotTwitch &&
            this.get_streams().map((l) => {
              return (
                <div className='live-element' key={l._id}>
                  <div className='card-live'>
                    <div className='banner'>
                      {' '}
                      <img
                        alt='banner'
                        src={
                          l.channel.video_banner
                            ? l.channel.video_banner
                            : this.default_banner
                        }
                      ></img>{' '}
                    </div>
                    <div className='logo pulse'>
                      {' '}
                      <img alt='logo' src={l.channel.logo}></img>{' '}
                    </div>
                    <div className='viewers'>
                      {(parseInt(l.viewers) / 1000).toFixed(2)}k
                    </div>

                    <div className='infos'>
                      <div className='name'> {l.channel.display_name} </div>
                      <div className='game'>{l.channel.game}</div>
                      <div className='hour'>
                        {l.created_at.substring(11, 13)} h{l.url}
                      </div>
                      <a href={'http://twitch.tv/' + l.nom} target='_blank'>
                        <div className='play'>
                          <div className='round-button'>
                            <IoMdPlay />
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <h3>Revoir</h3>
        <div
          className={
            ' lives-grid ' + (this.state.loaded === 1 ? ' loaded ' : ' hidden ')
          }
        >
          {this.state &&
            this.state.lives &&
            this.get_old_lives().map((l) => {
              let banner = '';
              console.log(l);
              if (l.plateforme == 'Facebook') {
                banner = this.facebook_banner;
              }
              if (l.plateforme == 'Instagram') {
                banner = this.instagram_banner;
              }
              if (l.plateforme == 'Youtube') {
                banner = this.youtube_banner;
              }
              if (l.plateforme == 'Zoom') {
                banner = this.facebook_banner;
              }
              if (l.plateforme == 'Twitch') {
                banner = this.twitch_banner;
              }
              return (
                <div className='live-element' key={l._id}>
                  <div className='card-live'>
                    <div className='banner'>
                      {' '}
                      <img alt='banner' src={banner}></img>{' '}
                    </div>
                    <div className='logo pulse'>
                      {' '}
                      <img alt='logo' src={Logo}></img>{' '}
                    </div>

                    <div className='infos'>
                      <div className='name'> {l.email.split('@')[0]} </div>
                      <div className='game'>{l.game}</div>
                      <div className='hour'>
                        {l.created_at.substring(11, 13)} h{l.url}
                      </div>
                      <a href={l.lien} target='_blank'>
                        <div className='play'>
                          <div className='round-button'>
                            <IoMdPlay />
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

Lives.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(Lives);
