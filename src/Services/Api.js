import axios from 'axios';

const ApiUrl = "https://yodproapi.alanmalnique.com.br/api";

export default class Api {

    static ApiUrl() {
        return ApiUrl;
    }

    static getHeaders(token, contentType) {
        return {
            "Access-Control-Allow-Origin": "*",
            "Content-type": contentType ? contentType : 'application/json',
            'Accept': 'application/json',
            'Authorization': token ? 'Bearer ' + token : 'Bearer '
        }
    }

    static get(url, token) {
        const options = {
            url: `${ApiUrl}/${url}`,
            method: 'GET',
            headers: this.getHeaders(token)
        };
        return axios(options);
    }

    static post(url, dados, token) {
        const options = {
            url: `${ApiUrl}/${url}`,
            method: 'POST',
            headers: this.getHeaders(token),
            data: dados
        };
        return axios(options);
    }

    static put(url, dados, token, employ) {
        const options = {
            url: `${ApiUrl}/${url}`,
            method: 'PUT',
            headers: this.getHeaders(token, employ),
            data: dados
        };
        return axios(options);
    }

    static customRequest(url, metodo, dados, token, contentType) {
        const options = {
            url: `${ApiUrl}/${url}`,
            method: metodo,
            headers: this.getHeaders(token, contentType),
            data: dados ? dados : {}
        }
        return axios(options);
    }


    static handleErros(response) {
        if (response.status === 400) {
            return { status: 'badRequest', response: response.data.mensagem }
        } else if (response.status === 401) {
            return { status: 'unauthorized', response: 'Ops, parece que sua sessão expirou, faça um novo login para continuar!' }
        } else {
            return { status: 'serverError', response: 'Ops, ocorreu um erro interno em nosso servidor!' }
        }
    }
}