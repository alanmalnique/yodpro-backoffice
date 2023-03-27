// import { cpf, cnpj } from 'cpf-cnpj-validator';

export const validaForm = (form) => {

    var campos = [];
    var mensagem = "";
    var valido = true;
    var validoGeral = true;

    form.map((item) => {

        valido = true;

        if (!item.valor) {
            mensagem = item.campo + " não pode ficar vazio!";
            valido = false;
            validoGeral = false;
        }

        if (item.minLength) {
            if (item.valor.length < item.minLength) {
                mensagem = item.campo + " é muito curto(a)!";
                valido = false;
                validoGeral = false;
            }
        }

        if (item.tipo) {

            if (item.tipo === "nome") {
                let explodeNome = item.valor.split(" ");
                if (!explodeNome[1]) {
                    mensagem = item.campo + " não foi preenchido corretamente!";
                    valido = false;
                    validoGeral = false;
                }
            }

            if (item.tipo === "email") {
                let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if (reg.test(item.valor) === false) {
                    mensagem = "O email não é valido!";
                    valido = false;
                    validoGeral = false;
                }
            }

        }
        campos.push({ campo: item.campo, attr: item.attr, mensagem: mensagem, valido: valido });
    });
    return { campos: campos, valido: validoGeral };
}