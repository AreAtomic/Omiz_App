/* Formulaire d'ajout de lives */

import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import axios from 'axios';

//Définition des catégories des lives
const options = [
  { value: 'Code', label: 'Code' },
  {
    type: 'group',
    name: 'Jeux-vidéo',
    items: [
      { value: 'Minecraft', label: 'Minecraft' },
      { value: 'League of Legends', label: 'League of Legends' },
      { value: 'Fifa', label: 'Fifa' },
      { value: 'NBA 2K', label: 'NBA 2K' },
      { value: 'Animal Crossing', label: 'Animal Crossing' },
      { value: 'Rocket League', label: 'Rocket League' },
      { value: 'HeartStone', label: 'HeartStone' },
      { value: 'Pokémon', label: 'Pokémon' },
      { value: 'World of Warcraft', label: 'World of Warcraft' },
    ],
  },
  {
    type: 'group',
    name: 'Sport',
    items: [
      { value: 'Cyclisme', label: 'Cyclisme' },
      { value: 'Zwift', label: 'Zwift' },
      { value: 'Zumba', label: 'Zumba' },
      { value: 'Musculation', label: 'Musculation' },
      { value: 'Running', label: 'Running' },
      { value: 'Danse', label: 'Danse' },
    ],
  },
  {
    type: 'group',
    name: 'Musique',
    items: [
      { value: 'DJ', label: 'DJ' },
      { value: 'Festival', label: 'Festival' },
      { value: 'Boite de nuit', label: 'Boite de nuit' },
      { value: 'Soirée', label: 'Soirée' },
      { value: 'Classique', label: 'Classique' },
      { value: 'Concerto', label: 'Concerto' },
    ],
  },
];


// Définition des plateformes de lives
const plateforme = [
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Youtube', label: 'Youtube' },
  { value: 'Zoom', label: 'Zoom' },
  { value: 'Twitch', label: 'Twitch' },
];

export default class FormLive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nom: '',
      lien: '',
      plateforme: '',
      user: '',
      email: '',
      selected: '',
      date: '',
      time: '',
    };

    //Binding methods
    this._onSelect = this._onSelect.bind(this);
    this._onSelect2 = this._onSelect2.bind(this);
    this._onDate = this._onDate.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  componentWillMount() {
    this.setState({
      email: this.props.email,
      date: this.props.date,
    });
  }

  componentDidMount() {
    this.setState({
      email: this.props.email,
      date: this.props.date,
    });
  }

  // Méthodes de sélections
  _onSelect(option) {
    this.setState({ selected: option.value });
  }
  _onSelect2(option) {
    this.setState({ plateforme: option.value });
  }
  _onDate = (e) => {
    this.setState({ date: e.target.value });
  };
  _onTime = (e) => {
    this.setState({ time: e.target.value });
  };
  _onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  // Méthode de post du nouveau live
  onClick = () => {
    var isValid = true;
    //Validation
    if (this.state.date == undefined || this.state.date == '') {
      document.getElementById('date').className = 'required';
      isValid = false;
    }
    if (this.state.time == '' || this.state.time == undefined) {
      document.getElementById('time').className = 'required';
      isValid = false;
    }
    if (this.state.nom == '' || this.state.nom == undefined) {
      document.getElementById('nom').className = 'required';
      isValid = false;
    }
    if (this.state.lien == '' || this.state.lien == undefined) {
      document.getElementById('lien').className = 'required';
      isValid = false;
    }
    if (this.state.plateforme == '' || this.state.plateforme == undefined) {
      document.getElementById('plateforme').className = 'required';
      isValid = false;
    }
    if (this.state.selected == '' || this.state.selected == undefined) {
      document.getElementById('selected').className = 'required';
      isValid = false;
    }
    if (!this.validURL(this.state.lien)) {
      document.getElementById('lien').className = 'required';
      isValid = false;
    }
    if (isValid == false) {
      return;
    }

    const state = this.state;
    let dates = '';

    //Formatage
    for (var i = 0; i < state.date.length; i++) {
      if (state.date[i] == '-') {
        dates += ':';
      } else {
        dates += state.date[i];
      }
    }

    // Export
    let time = state.time + ':00.000000Z';
    const date = dates + 'T' + time;
    const data = {
        nom : state.nom,
        lien: state.lien,
        plateforme: state.plateforme,
        user: state.user,
        email: state.email,
        game: state.selected,
        created_at: date,

    }
    axios.post('/api/lives/user', data).then((res) => console.log(res))
    console.log(state);
  };

  // Validation de l'URL
  validURL(str) {
    var pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator
    return !!pattern.test(str);
  }

  render() {
    const {
      toggleClassName,
      togglePlaholderClassName,
      toggleMenuClassName,
      toggleOptionsClassName,
    } = this.state;

    // Initialisations des variables
    this.state.email = this.props.email;
    const defaultOption = this.state.selected;
    const defaultOption2 = this.state.plateforme;

    // Vérification des dropdowns
    const placeHolderValue =
      typeof this.state.selected === 'string'
        ? this.state.selected
        : this.state.selected.value;
    const placeHolderValue2 =
      typeof this.state.plateforme === 'string'
        ? this.state.plateforme
        : this.state.plateforme.value;
    return (
      <div className='container'>
        <form className='formulaire'>
          <div className='dropdown reverse'>
            <input
              onChange={this._onChange}
              value={this.state.nom}
              required={true}
              id='nom'
              type='nom'
            />
            <label htmlFor='email'>Nom du live</label>
          </div>
          <div className='dropdown reverse'>
            <input
              onChange={this._onDate}
              value={this.state.date}
              id='date'
              type='date'
              required={true}
            />
            <label htmlFor='date'>Date du live</label>
          </div>
          <div className='dropdown reverse'>
            <input
              onChange={this._onChange}
              value={this.state.lien}
              id='lien'
              type='lien'
              required={true}
            />
            <label htmlFor='lien'>Lien</label>
          </div>
          <div className='dropdown reverse'>
            <input
              onChange={this._onChange}
              value={this.state.time}
              id='time'
              type='time'
              required={true}
            />
            <label htmlFor='time'>Heure</label>
          </div>
          <div className='dropdown' id='selected'>
            <Dropdown
              options={options}
              content='+'
              onChange={this._onSelect}
              value={defaultOption}
              placeholder='Choisis ton sujet'
              className={toggleClassName ? 'my-custom-class' : ''}
              placeholderClassName={
                togglePlaholderClassName ? 'my-custom-class' : ''
              }
              menuClassName={toggleMenuClassName ? 'my-custom-class' : ''}
            />
          </div>
          <div className='dropdown' id='plateforme'>
            <Dropdown
              options={plateforme}
              content='+'
              onChange={this._onSelect2}
              value={defaultOption2}
              placeholder='Quelle plateforme ?'
              className={toggleClassName ? 'my-custom-class' : ''}
              placeholderClassName={
                togglePlaholderClassName ? 'my-custom-class' : ''
              }
              menuClassName={toggleMenuClassName ? 'my-custom-class' : ''}
            />
          </div>
          <div className='rowButton'>
            <div onClick={this.onClick} className='button yellow'>
              Valider
            </div>
          </div>
        </form>
      </div>
    );
  }
}
