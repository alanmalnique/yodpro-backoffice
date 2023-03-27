import React, { Component, Fragment } from 'react';

import iconSair from '../resources/img/icon-sair.svg';

import { Link } from 'react-router-dom';

export default class Header extends Component {

    realizaLogout() {
        localStorage.removeItem('usuario');
    }

    render() {
        return (
            <Fragment>
                <div className="navbar">
                    <div className="barLinks">
                        <ul>
                            <li>
                                <Link to="/" onClick={() => { this.realizaLogout() }}>Sair <img src={iconSair} alt="Ícone de logout" /></Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </Fragment>
        )
    }
}