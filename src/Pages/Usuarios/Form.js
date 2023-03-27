import React, { Component, Fragment } from 'react';

import SideMenu from '../../Components/SideMenu';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import Redirect from '../../Components/RedirectScreen';
import Input from '../../Components/Input';
import Alert from '../../Components/Alert';
import Loading from '../../Components/LoaderScreen';
import { celularMask } from '../../Services/mask';
import { validaForm } from '../../Services/FormValidator';
import Api from '../../Services/Api';

import { Link } from 'react-router-dom';

export default class UsuariosForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            redirect: false,
            path: '',
            alert: false,
            alertText: '',
            statusOptions: [
                { value: '', text: 'Selecione' },
                { value: 1, text: 'Ativo' },
                { value: 2, text: 'Inativo' }
            ],
            nome: '',
            email: '',
            celular: '',
            status: '',
            senha: '',
        };
    }

    componentDidMount() {
        if (this.props.location.state) this.pegaUsuarioEditavel();
    }

    async pegaUsuarioEditavel() {
        const { usuario } = this.props.location.state;
        this.setState({ loading: true });
        const userData = JSON.parse(localStorage.getItem('usuario'));

        await Api.get('usuario/' + usuario.id, userData.token)
            .then(result => {
                const res = result.data.data;
                this.setState({
                    id: res.usu_id, 
                    nome: res.usu_nome, 
                    email: res.usu_email, 
                    status: res.usu_ativo, 
                    celular: res.usu_celular,
                    loading: false
                });
            })
            .catch(err => {
                const valida = Api.handleErros(err.response);
                if (valida.status === "unauthorized") {
                    sessionStorage.removeItem('userData');
                    this.setState({ path: '/' });
                }
                if (valida.status === "serverError") {
                    this.setState({ path: null });
                }

                if (valida.status === "badRequest") {
                    this.setState({ path: null });
                }
                this.setState({ loading: false, alertText: valida.response, alert: true });
            })
    }

    async handleChange(event, attr, type) {
        if (type === "telefone") {
            this.setState({ [attr]: celularMask(event.target.value) });
        } else {
            this.setState({ [attr]: event.target.value });
        }
    }

    validaCampos() {
        const { nome, status, celular, email, senha } = this.state;
        let form = [
            { campo: 'Nome', attr: 'nome', valor: nome },
            { campo: 'E-mail', attr: 'email', valor: email, tipo: "email" },
            { campo: 'Celular', attr: 'celular', valor: celular, tipo: "telefone" },
            { campo: 'Status', attr: 'status', valor: status }
        ];
        if (!this.props.location.state)
            form.push({ campo: 'Senha', attr: 'senha', valor: senha, minLength: 5 });

        const valida = validaForm(form);
        if (valida.valido && status) {
            this.setState({ loading: true });
            var formData = {
                usu_nome: nome,
                usu_email: email,
                usu_ativo: status,
                usu_celular: celular
            }
            const userData = JSON.parse(localStorage.getItem('usuario'));
            if (this.props.location.state) {
                if (senha) {
                    formData.usu_senha = senha;
                }
                this.editarConta(formData, userData.token);
            } else {
                this.novaConta(formData, userData.token);
            }
        }

        if (!status)
            this.setState({ alertText: '* O campo Status não foi preenchido', alert: true });

        if (!valida.valido) {
            for (let item of valida.campos) {
                if (!item.valido) {
                    this.setState({ alertText: '* ' + item.mensagem, alert: true });
                    break;
                }
            }
        }
    }

    async novaConta(form, token) {
        await Api.post('usuario', form, token)
            .then(res => {
                this.setState({ path: '/usuarios', loading: false, redirect: true });
            })
            .catch(err => {
                const valida = Api.handleErros(err.response);
                if (valida.status === "unauthorized") {
                    sessionStorage.removeItem('userData');
                    this.setState({ path: '/' });
                }
                if (valida.status === "serverError") {
                    this.setState({ path: null });
                }

                if (valida.status === "badRequest") {
                    this.setState({ path: null });
                }
                this.setState({ loading: false, alertText: valida.response, alert: true });
            })
    }

    async editarConta(form, token) {
        const { usuario } = this.props.location.state;
        await Api.put('usuario/' + usuario.id, form, token)
            .then(res => {
                this.pegaUsuarioEditavel();
            })
            .catch(err => {
                const valida = Api.handleErros(err.response);
                if (valida.status === "unauthorized") {
                    sessionStorage.removeItem('userData');
                    this.setState({ path: '/' });
                }
                if (valida.status === "serverError") {
                    this.setState({ path: null });
                }

                if (valida.status === "badRequest") {
                    this.setState({ path: null });
                }
                this.setState({ loading: false, alertText: valida.response, alert: true });
            })
    }

    render() {
        const { loading, redirect, path, alert, alertText, statusOptions, nome, status, celular, email, senha } = this.state;
        return (
            <Fragment>
                <Redirect redirect={redirect} path={path} />
                <Alert show={alert} texto={alertText} action={() => this.setState({ alert: false, redirect: path ? true : false })} />
                <Loading show={loading} />
                <SideMenu menuAtivo={3} />

                <div className="body">
                    <Header />

                    <div className="usuario-empresa-novo mgDefault">
                        <h1>{this.props.location.state ? 'Editar' : 'Novo'} Usuário</h1>
                        <p className="descricao">Informe abaixo os dados do usuário.</p>

                        <div className="panel">
                            <div className="panelHeader">
                                <h3>Dados Básicos</h3>
                            </div>
                            <div className="panelBody">
                                <div className="multInput" style={{ marginTop: 24 }}>
                                    <Input type="text" label="Nome" value={nome} onChange={e => this.handleChange(e, "nome")} />
                                    <Input type="select" label="Status" optionsData={statusOptions} divStyle={{ maxWidth: 346 }}
                                        onChange={e => this.handleChange(e, 'status')} value={status} />
                                    <Input type="tel" label="Celular" value={celular} maxLength="15" onChange={e => this.handleChange(e, "celular", "telefone")} style={{ marginRight: 0 }} />
                                </div>
                            </div>
                        </div>

                        <div className="panel">
                            <div className="panelHeader">
                                <h3>Dados de Acesso</h3>
                            </div>
                            <div className="panelBody">
                                <div className="multInput">
                                    <Input type="tel" label="E-mail" value={email} onChange={e => this.handleChange(e, "email")} />
                                    <Input type="password" label="Senha" value={senha} onChange={e => this.handleChange(e, "senha")}
                                        style={{ marginRight: 0 }} divStyle={{ maxWidth: 600 }} />
                                </div>
                            </div>
                        </div>

                        <div className="acoes">
                            <Link to="/usuarios" className="btn">{'<'} Voltar</Link>
                            <button className="btn btnCadastrar" onClick={() => this.validaCampos()}>{this.props.location.state ? 'Alterar' : 'Cadastrar'}</button>
                        </div>
                    </div>
                </div>
                <Footer />
            </Fragment>
        )
    }
}