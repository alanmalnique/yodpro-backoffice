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

export default class LocaisForm extends Component {

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
            descricao: '',
            endereco: '',
            latitude: '',
            longitude: '',
            status: '',
        };
    }

    componentDidMount() {
        if (this.props.location.state) this.pegaLocalEditavel();
    }

    async pegaLocalEditavel() {
        const { local } = this.props.location.state;
        this.setState({ loading: true });
        const userData = JSON.parse(localStorage.getItem('usuario'));

        await Api.get('locais/' + local.id, userData.token)
            .then(result => {
                const res = result.data.data;
                this.setState({
                    id: res.loc_id, 
                    descricao: res.loc_descricao, 
                    endereco: res.loc_endereco, 
                    status: res.loc_ativo, 
                    latitude: res.loc_latitude,
                    longitude: res.loc_longitude,
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
        const { descricao, endereco, latitude, longitude, status } = this.state;
        let form = [
            { campo: 'Descrição', attr: 'descricao', valor: descricao },
            { campo: 'Endereço', attr: 'endereco', valor: endereco },
            { campo: 'Status', attr: 'status', valor: status }
        ];

        const valida = validaForm(form);
        if (valida.valido && status) {
            this.setState({ loading: true });
            const formData = {
                loc_descricao: descricao,
                loc_endereco: endereco,
                loc_latitude: latitude,
                loc_longitude: longitude,
                loc_ativo: status,
            }
            const userData = JSON.parse(localStorage.getItem('usuario'));
            if (this.props.location.state) {
                this.editarLocal(formData, userData.token);
            } else {
                this.novoLocal(formData, userData.token);
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

    async novoLocal(form, token) {
        await Api.post('locais', form, token)
            .then(res => {
                this.setState({ path: '/locais', loading: false, redirect: true });
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

    async editarLocal(form, token) {
        const { local } = this.props.location.state;
        await Api.put('locais/' + local.id, form, token)
            .then(res => {
                this.pegaLocalEditavel();
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
        const { loading, redirect, path, alert, alertText, statusOptions, descricao, status, endereco } = this.state;
        return (
            <Fragment>
                <Redirect redirect={redirect} path={path} />
                <Alert show={alert} texto={alertText} action={() => this.setState({ alert: false, redirect: path ? true : false })} />
                <Loading show={loading} />
                <SideMenu menuAtivo={3} />

                <div className="body">
                    <Header />

                    <div className="usuario-empresa-novo mgDefault">
                        <h1>{this.props.location.state ? 'Editar' : 'Novo'} Local</h1>
                        <p className="descricao">Informe abaixo os dados do local.</p>

                        <div className="panel">
                            <div className="panelHeader">
                                <h3>Dados Básicos</h3>
                            </div>
                            <div className="panelBody">
                                <div className="multInput" style={{ marginTop: 24 }}>
                                    <Input type="text" label="Descrição" value={descricao} onChange={e => this.handleChange(e, "descricao")} />
                                    <Input type="select" label="Status" optionsData={statusOptions} divStyle={{ maxWidth: 346 }}
                                        onChange={e => this.handleChange(e, 'status')} value={status} />
                                </div>
                                <div className="multInput" style={{ marginTop: 24 }}>
                                    <Input type="text" label="Endereço" value={endereco} onChange={e => this.handleChange(e, "endereco")} />
                                </div>
                            </div>
                        </div>

                        <div className="acoes">
                            <Link to="/locais" className="btn">{'<'} Voltar</Link>
                            <button className="btn btnCadastrar" onClick={() => this.validaCampos()}>{this.props.location.state ? 'Alterar' : 'Cadastrar'}</button>
                        </div>
                    </div>
                </div>
                <Footer />
            </Fragment>
        )
    }
}