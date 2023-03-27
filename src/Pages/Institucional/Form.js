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

export default class InstitucionalForm extends Component {

    constructor(props) {
        super(props);

        this.pegaArquivo = this.pegaArquivo.bind(this);

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
            tiposOptions: [
                { value: '', text: 'Selecione' },
                { value: 1, text: 'Banner' },
                { value: 2, text: 'Serviços' },
                { value: 3, text: 'Vantagem' },
            ],
            titulo: '',
            texto: '',
            status: '',
            tipo: '',
            arquivo: ''
        };
    }

    componentDidMount() {
        if (this.props.location.state) this.pegaInstitucionalEditavel();
    }

    async pegaInstitucionalEditavel() {
        const { local } = this.props.location.state;
        this.setState({ loading: true });
        const userData = JSON.parse(localStorage.getItem('usuario'));

        await Api.get('institucional/' + local.id, userData.token)
            .then(result => {
                const res = result.data.data;
                this.setState({
                    id: res.inst_id, 
                    titulo: res.inst_titulo, 
                    texto: res.inst_texto, 
                    status: res.inst_ativo, 
                    tipo: res.inst_tipo,
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
        this.setState({ [attr]: event.target.value });
    }

    validaCampos() {
        const { titulo, texto, tipo, status, arquivo } = this.state;
        let form = [
            { campo: 'Título', attr: 'titulo', valor: titulo },
            { campo: 'Tipo', attr: 'tipo', valor: tipo },
            { campo: 'Texto', attr: 'texto', valor: texto },
            { campo: 'Status', attr: 'status', valor: status }
        ];

        const valida = validaForm(form);
        if (valida.valido && status) {
            this.setState({ loading: true });
            const formData = new FormData();
            if (arquivo !== '') {
                formData.append('arquivo', arquivo, arquivo.name);
            }
            formData.append('inst_titulo', titulo);
            formData.append('inst_texto', texto);
            formData.append('inst_ativo', status);
            formData.append('inst_tipo', tipo);
            const userData = JSON.parse(localStorage.getItem('usuario'));
            if (this.props.location.state) {
                this.editarInstitucional(formData, userData.token);
            } else {
                this.novoInstitucional(formData, userData.token);
            }
        }

        if (!status)
            this.setState({ alertText: '* O campo Status não foi preenchido', alert: true });

        if (!tipo)
            this.setState({ alertText: '* O campo Tipo não foi preenchido', alert: true });

        if (!valida.valido) {
            for (let item of valida.campos) {
                if (!item.valido) {
                    this.setState({ alertText: '* ' + item.mensagem, alert: true });
                    break;
                }
            }
        }
    }

    async novoInstitucional(form, token) {
        await Api.customRequest('institucional', 'POST', form, token, 'multipart/form-data')
            .then(res => {
                this.setState({ path: '/institucional', loading: false, redirect: true });
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

    async editarInstitucional(form, token) {
        const { local } = this.props.location.state;
        await Api.customRequest('institucional/' + local.id, 'POST', form, token, 'multipart/form-data')
            .then(res => {
                this.pegaInstitucionalEditavel();
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

    pegaArquivo(arquivo) {
        this.setState({ arquivo: arquivo[0] });
    }

    render() {
        const { loading, redirect, path, alert, alertText, tiposOptions, statusOptions, titulo, status, tipo, texto } = this.state;
        return (
            <Fragment>
                <Redirect redirect={redirect} path={path} />
                <Alert show={alert} texto={alertText} action={() => this.setState({ alert: false, redirect: path ? true : false })} />
                <Loading show={loading} />
                <SideMenu menuAtivo={4} />

                <div className="body">
                    <Header />

                    <div className="usuario-empresa-novo mgDefault">
                        <h1>{this.props.location.state ? 'Editar' : 'Novo'} Institucional</h1>
                        <p className="descricao">Informe abaixo os dados do institucional.</p>

                        <div className="panel">
                            <div className="panelHeader">
                                <h3>Dados Básicos</h3>
                            </div>
                            <div className="panelBody">
                                <div className="multInput" style={{ marginTop: 24 }}>
                                    <Input type="text" label="Título" value={titulo} onChange={e => this.handleChange(e, "titulo")} />
                                    <Input type="select" label="Tipo" optionsData={tiposOptions} divStyle={{ maxWidth: 346 }}
                                        onChange={e => this.handleChange(e, 'tipo')} value={tipo} />
                                    <Input type="select" label="Status" optionsData={statusOptions} divStyle={{ maxWidth: 346 }}
                                        onChange={e => this.handleChange(e, 'status')} value={status} />
                                </div>
                                <div className="multInput" style={{ marginTop: 24 }}>
                                    <Input type="file" label="Imagem" accept=".png, .jpg" pegaArquivo={this.pegaArquivo} />
                                </div>
                                <div className="multInput" style={{ marginTop: 24 }}>
                                    <Input type="textarea" label="Texto" value={texto} onChange={e => this.handleChange(e, "texto")} />
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