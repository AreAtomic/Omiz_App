import React from 'react';
import axios from 'axios';
import WaveLoader from '../WaveLoader';
import Explorer from '../Explorer';

// Import des logos
import Logo from '../Logo';
import { IoMdPlay, IoMdLogIn } from 'react-icons/io';
import { Link } from 'react-router-dom';

class Lives extends React.Component {
  constructor(props) {
    super();
    this.default_banner =
      'https://blog.twitch.tv/assets/uploads/generic-email-header-1.jpg';
    this.state = {
      // Lives twitch
      lives: [],
      // Lives rajoutés par les utilisateurs
      livesNotTwitch: [],
      // Lives passés
      oldLives: [],
      loaded: -1,
      search_value: '',
    };

    // Binding methods
    this.handle_search = this.handle_search.bind(this);
    this.get_streams = this.get_streams.bind(this);
    this.get_old_user_streams = this.get_old_user_streams.bind(this);
  }

  componentDidMount() {
    // Récupération des lives twitch
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
    // Récupération des lives rajouté par les utilisateurs
    axios.get('http://localhost:5000/api/lives/user').then(({ data }) => {
      // Variables de tempo
      let lives = data;
      let oldLives = this.state.oldLives;
      let newlive = [];
      let dates = new Date(Date.now());
      let day = dates.getDate() - 2;
      dates.setDate(day);
      dates = dates.toISOString();
      let date = '';
      // Formatage
      for (var i = 0; i < dates.length; i++) {
        if (dates[i] == '-') {
          date += ':';
        } else {
          date += dates[i];
        }
      }
      lives.map((l) => {
        // Vérification de la date pour trie
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
  }

  handle_search(event) {
    this.setState({ search_value: event.target.value });
  }

  // Retourne tous les lives twitchs
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
    } else {
      return this.state.lives;
    }
  }

  // Retourne tous les lives rajoutés par les utilisateurs
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
    } else {
      return this.state.livesNotTwitch;
    }
  }

  // Retourne les lives rajoutés par les utilisateurs passé
  get_old_user_streams() {
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
    return (
      <div id='main'>
        <Link className='button start connexion' to='/login'>
          <IoMdLogIn />
        </Link>
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
          <h3>Tout vos lives, au même endroit.</h3>
        </div>
        <Explorer />
        {this.state.loaded < 1 && (
          <WaveLoader className={this.state.loaded === 0 ? ' out ' : ' '} />
        )}
        <h3>En ce moment</h3>
        <div
          className={
            ' lives-grid ' + (this.state.loaded === 1 ? ' loaded ' : ' hidden ')
          }
        >
          {this.state &&
            this.state.lives &&
            this.get_streams().map((l) => {
              return (
                <div className='live-element' key={l._id}>
                  <a
                    href={'http://twitch.tv/' + l.channel.name}
                    target='_blank'
                  >
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
                        <div className='date'>
                          {l.created_at.substring(0, 6)}
                        </div>
                        <div className='hour'>
                          {l.created_at.substring(11, 13)} h{l.url}
                        </div>
                        <div className='play'>
                          <div class='round-button'>
                            <IoMdPlay />
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
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
        <h3>Revoir</h3>
        <div
          className={
            ' lives-grid ' + (this.state.loaded === 1 ? ' loaded ' : ' hidden ')
          }
        >
          {this.state &&
            this.state.lives &&
            this.get_old_user_streams().map((l) => {
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
      </div>
    );
  }
}

export default Lives;
