import React, { Component, Fragment } from 'react';

import logo from '../resources/img/logo.png';

import { Link } from 'react-router-dom';

export default class SideMenu extends Component {

    constructor() {
        super();

        this.state = {
            nomeUsuario: '',
            menus: [
                { nome: 'Dashboard', url: '/home' },
                { nome: 'Usuários', url: '/usuarios' },
                { nome: 'Locais', url: '/locais' },
                { nome: 'Problemas', url: '/problemas' },
                { nome: 'Institucional', url: '/institucional' },
                { nome: 'Relatório Geral', url: '/relatorio' }
            ]
        }
    }

    componentDidMount() {
        const userData = localStorage.getItem('usuario');
        if (userData) {
            const user = JSON.parse(userData);
            this.setState({ nomeUsuario: user.usuario.nome.split(" ")[0] });
        } else {
            this.setState({ nomeUsuario: 'Usuário' })
        }
    }

    render() {
        const { menuAtivo } = this.props;
        const { nomeUsuario, menus } = this.state;
        return (
            <Fragment>
                <div className="sideMenuBar bg-roxo">
                    <div className="profile">
                        <img src={logo} alt="Logo" width="100" />
                        <p>Olá, {nomeUsuario}.</p>
                    </div>
                    <div className="navigation">
                        <ul>
                            {menus.map((item, idx) => {
                                var btnClass = "dropdown-btn";
                                const ultimoItem = (idx + 1) === menus.length ? "noBorder" : "";
                                const url = window.location.pathname.split("/");
                                if ("/"+url[1] === item.url) btnClass = btnClass + " active";
                                return (
                                    <li key={"menu-"+idx}>
                                        <Link to={item.url} className={"/"+url[1] === item.url ? `active ${ultimoItem}` : ultimoItem}
                                            style={menuAtivo === (idx + 1) ? { borderBottom: 'none' } : {}}>
                                            <div className="menuIcone">
                                                <span>{item.nome}</span>
                                            </div>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </Fragment>
        )
    }
}