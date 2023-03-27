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
import { dataBrMask } from '../../Services/mask';
import Functions from '../../Services/Functions';

export default class ProblemasListar extends Component {

    constructor() {
        super();

        this.acaoVisualizar = this.acaoVisualizar.bind(this);
        this.acaoRelatorio = this.acaoRelatorio.bind(this);
        this.handlePage = this.handlePage.bind(this);

        this.state = {
            redirect: false,
            path: '',
            propsToPath: '',
            loading: false,
            alert: false,
            alertText: '',
            data_inicio: '',
            data_fim: '',
            status: '',
            local: '',
            id: '',
            table: {
                campos: [
                    { titulo: 'Código', dado: 'id' },
                    { titulo: 'Descrição', dado: 'descricao' },
                    { titulo: 'Local', dado: 'local' },
                    { titulo: 'Status', dado: 'status' },
                    { titulo: 'Ação', dado: 'acoes' }
                ],
                dados: []
            },
            statusOptions: [
                { value: '', text: 'Selecione' },
                { value: 1, text: 'Aberto' },
                { value: 2, text: 'Finalizado' }
            ],
            locaisOptions: [],
            exibeDados: false,
            mostraVazio: false,
            problemasDefault: []
        };
    }

    componentDidMount() {
        this.carregaLocais();
    }

    async carregaLocais() {
        const userData = JSON.parse(localStorage.getItem('usuario'));

        this.setState({ loading: true });

        await Api.get('locais?per_page=-1', userData.token)
            .then(result => {
                const res = result.data;
                var objects = [];
                objects.push({ value: '', text: 'Selecione' });
                for (var i = 0; i < res.data.length; i++) {
                    const item = res.data[i];
                    objects.push({
                        value: item.loc_id,
                        text: item.loc_descricao
                    })
                }
                this.setState({ locaisOptions: objects, loading: false });
                this.carregaProblemas(1);
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

    async carregaProblemas(page) {
        const userData = JSON.parse(localStorage.getItem('usuario'));
        const { table, data_inicio, data_fim, status, local, id } = this.state;

        this.setState({ loading: true });

        var url, pagina, pagAtual, actions;
        pagina = Functions.getAllUrlParams(window.location.href);
        pagina = pagina.page ? pagina.page : 1;
        pagAtual = page ? page : pagina;

        if (pagAtual) {
            url = "problema?per_page=20&page=" + pagAtual;
        } else {
            url = "problema?per_page=20";
        }

        if (data_inicio) url = url + '&data_inicio=' + Functions.data2Americano(data_inicio);
        if (data_fim) url = url + '&data_fim=' + Functions.data2Americano(data_fim);
        if (status) url = url + '&status=' + status;
        if (local) url = url + '&local=' + local;
        if (id) url = url + '&id=' + id;

        await Api.get(url, userData.token)
            .then(result => {
                const res = result.data.data;
                var objects = [];
                for (var i = 0; i < res.length; i++) {
                    const item = res[i];
                    objects[i] = {
                        id: item.prob_id,
                        descricao: item.prob_titulo,
                        local: item.local.loc_descricao,
                        status: item.prob_status === 1 ? 'Aberto' : 'Finalizado',
                        acoes: 'visualizar|relatorio'
                    };
                }
                if (res.length > 0) {
                    this.setState({ exibeDados: true, loading: false, mostraVazio: false });
                } else {
                    this.setState({ loading: false, mostraVazio: true });
                }
                this.setState({ table: { campos: [...table.campos], dados: objects }, problemasDefault: result.data, loading: false });
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
            this.setState({ path: '/problemas?page=' + page, redirect: true });
        } else {
            this.setState({ path: '/problemas', redirect: true });
        }
        this.carregaProblemas(page);
    }

    acaoVisualizar(id) {
        this.setState({ path: '/problemas/form', propsToPath: { problema: { id } }, redirect: true });
    }

    acaoRelatorio(id) {
        this.setState({ loading: true });
        const { data_inicio, data_fim, status } = this.state;
        const userData = JSON.parse(localStorage.getItem('usuario'));

        var url = '/problema/'+id+'/relatorio/gerar?xls=true';

        var urlBase = Api.ApiUrl();
        const xhr = new XMLHttpRequest();
        xhr.open("GET", urlBase + url);
        xhr.setRequestHeader("Content-Type", "application/vnd.ms-excel");
        xhr.setRequestHeader("Authorization", "Bearer " + userData.token);
        xhr.responseType = "blob";

        xhr.onload = () => {
            var blob = new Blob([xhr.response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'Relatório do problema '+id+'.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.setState({ loading: false });
        };
        xhr.send();
    }

    render() {
        const { loading, redirect, path, propsToPath, alert, alertText, table, problemasDefault, statusOptions, locaisOptions, exibeDados, mostraVazio, data_inicio, data_fim, status, local, id } = this.state;

        return (
            <Fragment>
                <Loading show={loading} />
                <Redirect redirect={redirect} props={propsToPath} path={path} />
                <Alert show={alert} texto={alertText} action={() => this.setState({ alert: false, redirect: path ? true : false })} />
                <SideMenu menuAtivo={4} />

                <div className="body">
                    <Header />

                    <div className="leads mgDefault">
                        <div className="headerBtn">
                            <div>
                                <h1>Problemas</h1>
                                <p className="descricao">Abaixo a listagem de todos os problemas</p>
                            </div>
                        </div>

                        <div className="panel">
                            <div className="panelBody">
                                <div className="multInput" style={{ marginTop: 24 }}>
                                    <Input type="tel" label="Código" value={id} onChange={e => this.setState({ id: e.target.value })} />
                                    <Input type="tel" label="Data início" value={data_inicio} onChange={e => this.setState({ data_inicio: dataBrMask(e.target.value) })} />
                                    <Input type="tel" label="Data fim" value={data_fim} onChange={e => this.setState({ data_fim: dataBrMask(e.target.value) })} />
                                    <Input type="select" label="Status" optionsData={statusOptions} divStyle={{ maxWidth: 346, marginRight: 0 }}
                                        onChange={e => this.setState({ 'status': e.target.value })} value={status} />
                                    <Input type="select" label="Local" optionsData={locaisOptions} divStyle={{ maxWidth: 346, marginRight: 0 }}
                                        onChange={e => this.setState({ 'local': e.target.value })} value={local} />
                                    <button className="btn btnFiltrar" onClick={() => { this.carregaProblemas() }}>Filtrar</button>
                                </div>
                            </div>
                        </div>


                        <div className="detalhes">
                            <div className="panel">
                                {exibeDados ? (<>
                                    <Table campos={table.campos}
                                        dados={table.dados}
                                        acaoVisualizar={this.acaoVisualizar}
                                        acaoRelatorio={this.acaoRelatorio}
                                        selecionavel={false} />
                                </>) : null}
                                {mostraVazio ? (
                                    <p className="textEmpty">Nenhum problema encontrado!</p>
                                ) : null}
                            </div>
                            {exibeDados ? (<>
                                <div className="info">
                                    <p>Total de registros: {problemasDefault.total}</p>
                                    <Paginacao dados={problemasDefault}
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
