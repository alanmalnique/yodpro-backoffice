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
import Api from '../../Services/Api';

export default class Home extends Component {

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

    render() {
        const { email, senha, redirect, loading, alert, alertText } = this.state;

        return (
            <Fragment>
                <Redirect redirect={redirect} path="/home" />
                <Loading show={loading} />
                <Alert show={alert} texto={alertText} action={() => this.setState({ alert: false })} />
                <SideMenu menuAtivo={1} />
                
                <div className="body">
                    <Header />

                    <Footer />

                </div>
            </Fragment>
        )
    }
}
