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
import Functions from '../../Services/Functions';

import { Link } from 'react-router-dom';

export default class ProblemasForm extends Component {

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
                { value: 1, text: 'Aberto' },
                { value: 2, text: 'Finalizado' }
            ],
            titulo: '',
            descricao: '',
            local: '',
            usuario: '',
            comentarios: [],
            datahora_abertura: '',
            datahora_finalizado: '',
            status: '',
        };
    }

    componentDidMount() {
        if (this.props.location.state) this.pegaLocalEditavel();
    }

    async pegaLocalEditavel() {
        const { problema } = this.props.location.state;
        const { statusOptions } = this.state;
        this.setState({ loading: true });
        const userData = JSON.parse(localStorage.getItem('usuario'));

        await Api.get('problema/' + problema.id, userData.token)
            .then(result => {
                const res = result.data.data;
                this.setState({
                    id: res.prob_id, 
                    titulo: res.prob_titulo,
                    descricao: res.prob_descricao, 
                    status: statusOptions[res.prob_status].text, 
                    local: res.local.loc_descricao, 
                    datahora_abertura: Functions.dataHora2Brazilian(res.prob_datahora),
                    datahora_finalizado: Functions.dataHora2Brazilian(res.prob_dthrfinalizado),
                    usuario: res.usuario.usu_nome,
                    comentarios: res.comentarios,
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

    render() {
        const { loading, redirect, path, alert, alertText, statusOptions, titulo, descricao, status, local, datahora_abertura, datahora_finalizado, usuario, comentarios } = this.state;
        return (
            <Fragment>
                <Redirect redirect={redirect} path={path} />
                <Alert show={alert} texto={alertText} action={() => this.setState({ alert: false, redirect: path ? true : false })} />
                <Loading show={loading} />
                <SideMenu menuAtivo={4} />

                <div className="body">
                    <Header />

                    <div className="usuario-empresa-novo mgDefault">
                        <h1>Detalhes do problema</h1>
                        <p className="descricao">Abaixo estão os dados do problema.</p>

                        <div className="panel">
                            <div className="panelHeader">
                                <h3>Dados</h3>
                            </div>
                            <div className="panelBody">
                                <div className="multInput" style={{ marginTop: 24 }}>
                                    <Input type="text" label="Título" value={titulo} readOnly={true} divStyle={{ minWidth: 546 }} />
                                    <Input type="text" label="Local" value={local} readOnly={true} />
                                    <Input type="text" label="Status" value={status} readOnly={true} divStyle={{ maxWidth: 346 }} />
                                </div>
                                <div className="multInput">
                                    <Input type="text" label="Usuário" value={usuario} readOnly={true} />
                                    <Input type="text" label="Dt. Abertura" value={datahora_abertura} readOnly={true} />
                                    <Input type="text" label="Dt. Finalizado" value={datahora_finalizado} readOnly={true} />
                                </div>
                                <Input type="textarea" label="Descrição" value={descricao} readOnly={true} />
                            </div>
                        </div>

                        <div className="panel">
                            <div className="panelHeader">
                                <h3>Comentários</h3>
                            </div>
                            <div className="panelBody">
                                {comentarios.map((item, index) => {
                                    return (<>
                                        <div className="comentario" key={'comentario-'+index}>
                                            <div className="dados">
                                                <div className="usuario">Usuário: <b>{item.usuario.usu_nome}</b></div>
                                                <div className="datahora">{Functions.dataHora2Brazilian(item.probc_datahora)}</div>
                                            </div>
                                            <div className="texto">Comentário: <br />{item.probc_comentario}</div>
                                        </div>
                                    </>);
                                })}
                                {comentarios.length < 1 ? (
                                    <div>Nenhum comentário encontrado.</div>
                                ) : null}
                            </div>
                        </div>

                        <div className="acoes">
                            <Link to="/problemas" className="btn">{'<'} Voltar</Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </Fragment>
        )
    }
}