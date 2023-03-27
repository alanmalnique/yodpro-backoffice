import React, { Component, Fragment } from 'react';

import '../../resources/css/generals.scss';

import logo from '../../resources/img/logo.png';

import Redirect from '../../Components/RedirectScreen';
import Loading from '../../Components/LoaderScreen';
import Alert from '../../Components/Alert';
import Input from '../../Components/Input';
import SideMenu from '../../Components/SideMenu';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import Table from '../../Components/Table';
import Paginacao from '../../Components/Paginacao';
import Api from '../../Services/Api';
import Functions from '../../Services/Functions';

export default class LocaisListar extends Component {

    constructor() {
        super();

        this.acaoEditar = this.acaoEditar.bind(this);
        this.handlePage = this.handlePage.bind(this);

        this.state = {
            redirect: false,
            path: '',
            propsToPath: '',
            loading: false,
            alert: false,
            alertText: '',
            table: {
                campos: [
                    { titulo: 'ID', dado: 'id' },
                    { titulo: 'Descrição', dado: 'descricao' },
                    { titulo: 'Status', dado: 'status' },
                    { titulo: 'Ação', dado: 'acoes' }
                ],
                dados: []
            },
            exibeDados: false,
            mostraVazio: false,
            locaisDefault: []
        };
    }

    componentDidMount() {
        this.carregaLocais(1);
    }

    async carregaLocais(page) {
        const userData = JSON.parse(localStorage.getItem('usuario'));
        const { table } = this.state;

        this.setState({ loading: true });

        var url, pagina, pagAtual, actions;
        pagina = Functions.getAllUrlParams(window.location.href);
        pagina = pagina.page ? pagina.page : 1;
        pagAtual = page ? page : pagina;

        if (pagAtual) {
            url = "locais?per_page=20&page=" + pagAtual;
        } else {
            url = "locais?per_page=20";
        }

        await Api.get(url, userData.token)
            .then(result => {
                const res = result.data.data;
                var objects = [];
                for (var i = 0; i < res.length; i++) {
                    const item = res[i];
                    objects[i] = {
                        id: item.loc_id,
                        descricao: item.loc_descricao,
                        status: item.loc_ativo ? 'Ativo' : 'Inativo',
                        acoes: 'default'
                    };
                }
                console.log(objects);
                if (res.length > 0) {
                    this.setState({ exibeDados: true, loading: false, mostraVazio: false });
                } else {
                    this.setState({ loading: false, mostraVazio: true });
                }
                this.setState({ table: { campos: [...table.campos], dados: objects }, locaisDefault: result.data, loading: false });
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

    handlePage(page) {
        if (page) {
            this.setState({ path: '/locais?page=' + page, redirect: true });
        } else {
            this.setState({ path: '/locais', redirect: true });
        }
        this.carregalocais(page);
    }

    acaoEditar(id) {
        this.setState({ path: '/locais/form', propsToPath: { local: { id } }, redirect: true });
    }

    render() {
        const { loading, redirect, path, propsToPath, alert, alertText, table, locaisDefault, exibeDados, mostraVazio } = this.state;

        return (
            <Fragment>
                <Loading show={loading} />
                <Redirect redirect={redirect} props={propsToPath} path={path} />
                <Alert show={alert} texto={alertText} action={() => this.setState({ alert: false, redirect: path ? true : false })} />
                <SideMenu menuAtivo={3} />

                <div className="body">
                    <Header />

                    <div className="leads mgDefault">
                        <div className="headerBtn">
                            <div>
                                <h1>Locais</h1>
                                <p className="descricao">Abaixo a listagem de todos os locais</p>
                            </div>
                            <button className="btn btnAzul" onClick={() => { this.setState({ path: '/locais/form', redirect: true }) }}>Novo Local</button>
                        </div>

                        <div className="detalhes">
                            <div className="panel">
                                {exibeDados ? (<>
                                    <Table campos={table.campos}
                                        dados={table.dados}
                                        acaoEditar={this.acaoEditar}
                                        selecionavel={false} />
                                </>) : null}
                                {mostraVazio ? (
                                    <p className="textEmpty">Nenhum local encontrado!</p>
                                ) : null}
                            </div>
                            {exibeDados ? (<>
                                <div className="info">
                                    <p>Total de registros: {locaisDefault.total}</p>
                                    <Paginacao dados={locaisDefault}
                                        handlePage={this.handlePage} />
                                </div>
                            </>) : null}
                        </div>
                    </div>
                </div>
                <Footer />
            </Fragment>
        )
    }
}
