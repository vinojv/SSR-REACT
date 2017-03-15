import React, { Component, PropTypes } from 'react';
import config from '../../config';
import {Link} from 'react-router'

export default class App extends Component {

  render() {

    return (
      <div>
      	SERVER SIDE RENDERING
        {this.props.children}
        <Link to="/home">home</Link>
        <Link to="/about">about</Link>
        <Link to="/dsds">notfound</Link>
      </div>
    );
  }
}
