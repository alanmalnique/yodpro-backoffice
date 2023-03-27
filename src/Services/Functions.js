
export default class Funcoes {

    static float2Preco(valor) {
        if (valor || valor === 0)
            return valor.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    }

    static preco2float(valor, suffix) {
        let valDots = valor.replace(".", "");
        let val = suffix ? valDots.replace(',', '.').split(suffix)[1] : valDots.replace(',', '.');
        return parseFloat(val);
    }

    static data2Americano(data, separador) {
        let dataSeparate = data.split(separador ? separador : '/');
        return dataSeparate[2] + "-" + dataSeparate[1] + "-" + dataSeparate[0];
    }

    static data2Brazilian(data, separador) {
        if (data) {
            let dataSeparate = data.split(separador ? separador : '-');
            return dataSeparate[2] + "/" + dataSeparate[1] + "/" + dataSeparate[0];
        }
    }

    static dataHora2Brazilian(data, separador) {
        if (data) {
            let horaSeparate = data.split(" ");
            let dataSeparate = horaSeparate[0].split(separador ? separador : '-');
            return dataSeparate[2] + "/" + dataSeparate[1] + "/" + dataSeparate[0] + ' ' + horaSeparate[1];
        }
    }

    static dataHora2UsuarioFuso(dataHora)
    {
        let serverTimeZone = ' GMT -0300';
        let novaDataHora  = new Date(dataHora + serverTimeZone);
        let data = novaDataHora.getFullYear() + '-' + ("0" + (novaDataHora.getMonth() + 1)).slice(-2) + '-' + ("0" + (novaDataHora.getDate())).slice(-2)
        let hora = ("0" + (novaDataHora.getHours())).slice(-2)+':'+ ("0" + (novaDataHora.getMinutes())).slice(-2) +':'+ ("0" + (novaDataHora.getSeconds())).slice(-2);
        return data + ' ' + hora
    }
    static primeiroNome(nome) {
        return nome.split(' ')[0];
    }

    static leftPad(value, length, preffix) {
        var pad = "";
        if (value || value === 0) {
            for (var i = 0; i < length - value.toString().length; i++) {
                pad = pad + preffix;
            }
        }
        return pad + value;
    }

    static validaEmail(email) {
        return /^[\w+.]+@\w+\.\w{2,}(?:\.\w{2})?$/.test(email);
    }

    static completarNumero(num) {
        if (num || num === 0) {
            if (typeof (num) === "number") {
                return num < 10 ? '0' + num : num
            } else {
                return num.length < 10 ? '0' + num : num
            }
        }
    }

    static geraDataExtenso(data) {
        var dateSeparate, date;
        // const weekDay = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
        const month = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

        if (data) {
            dateSeparate = data.split('-');
            date = new Date(data);
        } else {
            date = new Date();
            const toJSON = date.toJSON().split('T')[0];
            dateSeparate = toJSON.split('-');
        }
        const diaMes = parseInt(dateSeparate[1]);
        //01 de Junho de 2020
        return (`${dateSeparate[2]} de ${month[diaMes - 1]} de ${dateSeparate[0]}`);
    }

    static removeMascara(tipo, data) {
        if (data) {
            if (tipo === "cpf") {
                return data.replace(/\./g, '').replace(/\-/g, '')
            } else if (tipo === "phone") {
                return data.replace('(', '').replace(')', '').replace(' ', '').replace('-', '')
            } else if (tipo === "cep") {
                return data.replace('-', '');
            }
        }
    }

    static nFormatter(num, digits) {
        var si = [
            { value: 1, symbol: "" },
            { value: 1E3, symbol: "k" },
            { value: 1E6, symbol: "M" },
            { value: 1E9, symbol: "G" },
            { value: 1E12, symbol: "T" },
            { value: 1E15, symbol: "P" },
            { value: 1E18, symbol: "E" }
        ];
        var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
                break;
            }
        }
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    }

    static getAllUrlParams(url) {

        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
        var obj = {};

        if (queryString) {
            queryString = queryString.split('#')[0];

            var arr = queryString.split('&');

            for (var i = 0; i < arr.length; i++) {
                var a = arr[i].split('=');
                var paramName = a[0];
                var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

                paramName = paramName.toLowerCase();
                if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

                if (paramName.match(/\[(\d+)?\]$/)) {

                    var key = paramName.replace(/\[(\d+)?\]/, '');
                    if (!obj[key]) obj[key] = [];

                    if (paramName.match(/\[\d+\]$/)) {
                        var index = /\[(\d+)\]/.exec(paramName)[1];
                        obj[key][index] = paramValue;
                    } else {
                        obj[key].push(paramValue);
                    }
                } else {
                    if (!obj[paramName]) {
                        obj[paramName] = paramValue;
                    } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                        obj[paramName] = [obj[paramName]];
                        obj[paramName].push(paramValue);
                    } else {
                        obj[paramName].push(paramValue);
                    }
                }
            }
        }
        return obj;
    }

    static getAcoesPage(menus, url) {
        var acoes = [];
        for (var i = 0; i < menus.length; i++) {
            const item = menus[i];
            if (item.bmnu_url === url) {
                for (var x = 0; x < item.acoes.length; x++) {
                    acoes.push(item.acoes[x].acmnu_id);
                }
            }else{
                if(item.filhos.length > 0){
                    for(var x = 0; x < item.filhos.length; x++){
                        const filho = item.filhos[x];
                        if(filho.bmnu_url === url){
                            for (var z = 0; z < filho.acoes.length; z++) {
                                acoes.push(filho.acoes[z].acmnu_id);
                            }
                        }
                    }
                }
            }
        }
        return acoes;
    }
    
    static getMultAcoesPage(menus, urls) {
        var acoes = []

        for (const url of urls) {
            for (var i = 0; i < menus.length; i++) {
                const item = menus[i];
                if (item.bmnu_url === url) {
                    for (var x = 0; x < item.acoes.length; x++) {
                        acoes.push(item.acoes[x].acmnu_id);
                    }
                }else{
                    if(item.filhos.length > 0){
                        for(var x = 0; x < item.filhos.length; x++){
                            const filho = item.filhos[x];
                            if(filho.bmnu_url === url){
                                for (var z = 0; z < filho.acoes.length; z++) {
                                    acoes.push(filho.acoes[z].acmnu_id);
                                }
                            }
                        }
                    }
                }
            }
        }
        return acoes;
    }
    
}