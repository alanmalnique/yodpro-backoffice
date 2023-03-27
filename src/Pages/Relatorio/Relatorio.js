import React, { Component, Fragment } from 'react';

import SideMenu from '../../Components/SideMenu';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import Redirect from '../../Components/RedirectScreen';
import Input from '../../Components/Input';
import Alert from '../../Components/Alert';
import Loading from '../../Components/LoaderScreen';
import Functions from '../../Services/Functions';
import { dataBrMask } from '../../Services/mask';
import Api from '../../Services/Api';

import { Link } from 'react-router-dom';

export default class Relatorio extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            redirect: false,
            path: '',
            alert: false,
            alertText: '',
            data_inicio: '',
            data_fim: '',
            status: '',
            local: '',
            statusOptions: [
                { value: '', text: 'Selecione' },
                { value: 1, text: 'Aberto' },
                { value: 2, text: 'Finalizado' }
            ],
            locaisOptions: [],
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

    async gerarRelatorio() {
        this.setState({ loading: true });
        const { data_inicio, data_fim, status, local } = this.state;
        const userData = JSON.parse(localStorage.getItem('usuario'));

        var url = '/problema/relatorio/gerar?xls=true';
        if (data_inicio) url = url + '&data_inicio=' + Functions.data2Americano(data_inicio);
        if (data_fim) url = url + '&data_fim=' + Functions.data2Americano(data_fim);
        if (status) url = url + '&status=' + status;
        if (local) url = url + '&local=' + local;

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
            link.download = 'Relatório de problemas.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.setState({ loading: false });
        };
        xhr.send();
    }

    render() {
        const { loading, redirect, path, alert, alertText, statusOptions, locaisOptions, data_inicio, data_fim, status, local } = this.state;
        return (
            <Fragment>
                <Redirect redirect={redirect} path={path} />
                <Alert show={alert} texto={alertText} action={() => this.setState({ alert: false, redirect: path ? true : false })} />
                <Loading show={loading} />
                <SideMenu menuAtivo={5} />

                <div className="body">
                    <Header />

                    <div className="usuario-empresa-novo mgDefault">
                        <h1>Relatório de Problemas</h1>
                        <p className="descricao">Informe os filtros para gerar o arquivo.</p>

                        <div className="panel">
                            <div className="panelBody">
                                <div className="multInput" style={{ marginTop: 24 }}>
                                    <Input type="tel" label="Data início" value={data_inicio} onChange={e => this.setState({ data_inicio: dataBrMask(e.target.value) })} />
                                    <Input type="tel" label="Data fim" value={data_fim} onChange={e => this.setState({ data_fim: dataBrMask(e.target.value) })} />
                                    <Input type="select" label="Status" optionsData={statusOptions} divStyle={{ maxWidth: 346, marginRight: 0 }}
                                        onChange={e => this.setState({ 'status': e.target.value })} value={status} />
                                    <Input type="select" label="Local" optionsData={locaisOptions} divStyle={{ maxWidth: 346, marginRight: 0 }}
                                        onChange={e => this.setState({ 'local': e.target.value })} value={local} />
                                </div>
                            </div>
                        </div>

                        <div className="acoes">
                            <button className="btn btnCadastrar" onClick={() => { this.gerarRelatorio() }}>Gerar Relatório (.xlsx)</button>
                        </div>
                    </div>
                </div>
                <Footer />
            </Fragment>
        )
    }
}