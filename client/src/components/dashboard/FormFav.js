/* Formulaire d'ajout de favoris et redirection vers les lives */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Dropdown from 'react-dropdown';
localStorage.clear();

// Définition des catégories des lives
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

class FormFav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      selected: '',
      selected2: '',
    };
    // Binding methods
    this._onSelect = this._onSelect.bind(this);
    this._onSelect2 = this._onSelect2.bind(this);
    this.onclick = this.onclick.bind(this);
  }

  componentWillMount() {
    this.setState({ email: this.props.email });
  }
  componentDidMount() {
    this.setState({ email: this.props.email });
  }

  // Sélection des élements du formulaires
  _onSelect(option) {
    console.log(option.value);
    this.setState({ selected: option.value });
  }
  _onSelect2(option) {
    this.setState({ selected2: option.value });
  }

  // POst des favoris
  onclick() {
    console.log(this.state);
    axios
      .post('/api/users/favoris', this.state, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  }
  render() {
    const {
      toggleClassName,
      togglePlaholderClassName,
      toggleMenuClassName,
      toggleOptionsClassName,
    } = this.state;

    this.state.email = this.props.email;
    if (this.props.favoris == undefined) {
      this.state.selected = 'Fais ton choix';
      this.state.selected2 = 'Fais ton choix';
    } else {
      if (this.state.selected == '') {
        this.state.selected = this.props.favoris[0];
      }
      if (this.state.selected2 == '') {
        this.state.selected2 = this.props.favoris[1];
      }
    }
    const defaultOption = this.state.selected;
    const defaultOption2 = this.state.selected2;

    const placeHolderValue =
      typeof this.state.selected === 'string'
        ? this.state.selected
        : this.state.selected.value;
    return (
      <div className='form'>
        <div className='dropdown'>
          <Dropdown
            options={options}
            content='+'
            onChange={this._onSelect}
            value={defaultOption}
            placeholder='Select an option'
            className={toggleClassName ? 'my-custom-class' : ''}
            placeholderClassName={
              togglePlaholderClassName ? 'my-custom-class' : ''
            }
            menuClassName={toggleMenuClassName ? 'my-custom-class' : ''}
          />
        </div>
        <div className='dropdown'>
          <Dropdown
            options={options}
            content='+'
            onChange={this._onSelect2}
            value={defaultOption2}
            placeholder='Select an option'
            className={toggleClassName ? 'my-custom-class' : ''}
            placeholderClassName={
              togglePlaholderClassName ? 'my-custom-class' : ''
            }
            menuClassName={toggleMenuClassName ? 'my-custom-class' : ''}
          />
        </div>
        <div className='rowButton'>
          <Link to='/lives/user'><div onClick={this.onclick} className='button'>
            GO Lives !
          </div></Link>
          <div onClick={this.onclick} className='button yellow'>
            Valider
          </div>
        </div>
        <div className="rowButton">
          <Link to='/lives/add' className='button live'>
            Créer un Live
          </Link>
        </div>
      </div>
    );
  }
}

export default FormFav;
