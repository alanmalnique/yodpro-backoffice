import React, { Component, Fragment } from 'react';

import '../../resources/css/generals.scss';
import './Login.scss';

import logo from '../../resources/img/logo.png';

import Redirect from '../../Components/RedirectScreen';
import Loading from '../../Components/LoaderScreen';
import Alert from '../../Components/Alert';
import Input from '../../Components/Input';
import Api from '../../Services/Api';

export default class Login extends Component {

    constructor() {
        super();

        this.state = {
            redirect: false,
            loading: false,
            alert: false,
            alertText: '',
            email: '',
            senha: ''
        };
    }

    async validaCampos() {
        const { email, senha } = this.state;

        if (email === '') {
            this.setState({ alertText: 'Preencha corretamente o campo email!', alert: true });
        } else if (senha === '') {
            this.setState({ alertText: 'Preencha corretamente o campo email!', alert: true });
        } else {
            this.setState({ loading: true });
            const form = {
                email: email,
                senha: senha
            };
            await Api.post('login', form)
                .then(res => {
                    console.log(res);
                    const salvaSession = {
                        usuario: {
                            id: res.data.data.usu_id,
                            nome: res.data.data.usu_nome,
                            email: res.data.data.usu_email
                        },
                        token: res.data.data.token
                    }
                    localStorage.setItem('usuario', JSON.stringify(salvaSession));
                    this.setState({ loading: false, redirect: true });
                })
                .catch(err => {
                    const valida = Api.handleErros(err.response);
                    this.setState({ loading: false, alertText: 'Usuário e/ou senha inválidos', alert: true });
                })
        }
    }

    handleSubmit(event) {
        if (event.key === "Enter") {
            this.validaCampos();
        }
    }

    render() {
        const { email, senha, redirect, loading, alert, alertText } = this.state;

        return (
            <Fragment>
                <Redirect redirect={redirect} path="/home" />
                <Loading show={loading} />
                <Alert show={alert} texto={alertText} action={() => this.setState({ alert: false })} />
                <div className="login">
                    <div className="contentLogin">
                        <div className="panel">
                            <img src={logo} alt="Logo" width="150" />

                            <div className="acessaForm">
                                <Input type="email" placeholder="E-mail" onChange={e => this.setState({ email: e.target.value })} value={email} />
                                <Input type="password" placeholder="Senha" maxLength="12" value={senha}
                                    onChange={e => this.setState({ senha: e.target.value })}
                                    onKeyPress={e => this.handleSubmit(e)} />
                                <button className="btn entrar" onClick={() => this.validaCampos()}>Entrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}
