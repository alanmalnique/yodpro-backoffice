import React, { Component, Fragment } from 'react';

// import iconSetaDir from '../resources/icon-seta-direita.svg';
// import iconSetaEsq from '../resources/icon-seta-esquerda.svg';

export default class Paginacao extends Component {

    constructor() {
        super();

        this.state = {
            porPagina: 20,
            maxPages: 6
        }
    }

    renderBotoes = () => {
        const { dados, handlePage } = this.props;
        const { porPagina, maxPages } = this.state;
        var pagina, totalPages, halfPages, firstVisible, lastVisible, objects = [];

        pagina = dados.current_page;
        totalPages = Math.ceil(dados.total / porPagina);
        halfPages = Math.ceil(maxPages / 2);

        if (totalPages > 1) {
            if (pagina > halfPages) {
                if (maxPages > totalPages) {
                    firstVisible = 1;
                    lastVisible = pagina + halfPages;
                } else {
                    firstVisible = pagina - halfPages;
                    lastVisible = pagina + halfPages;
                }
            } else {
                firstVisible = 1;
                lastVisible = maxPages;
            }

            //Se o total de paginas for menor que maxPages, nao exibe first e last
            if (maxPages < totalPages) {
                if (maxPages > (totalPages - firstVisible)) {
                    firstVisible = firstVisible - (maxPages - (totalPages - firstVisible));
                }
            }

            if (lastVisible > totalPages) {
                lastVisible = totalPages;
            }

            //monta arr com os botoes numeros
            for (var x = firstVisible; x <= lastVisible; x++) {
                objects.push({ active: x === pagina ? true : false, index: x });
            }

            return objects.map((page) => {
                return (
                    <button className={page.active ? "active" : ""} onClick={() => handlePage(page.index)}>{page.index}</button>
                )
            })
        }
    }

    render() {
        const { dados, style, handlePage } = this.props;
        var pagAtual = dados.current_page;
        var ultPag = dados.last_page;
        return (
            <Fragment>
                {ultPag > 1 ? (
                    <div className="paginacao" style={style}>
                        {pagAtual > 1 ? (
                            <button onClick={() => handlePage(1)} className="btnPageExtremos"><span>&laquo;</span></button>
                        ) : null}

                        <button className={pagAtual === 1 ? "disabled" : ''} disabled={pagAtual === 1 ? true : false}
                            onClick={() => handlePage(pagAtual - 1)}>&#60;</button>

                        {this.renderBotoes()}

                        <button className={pagAtual === ultPag ? "disabled" : ''} disabled={pagAtual === ultPag ? true : false}
                            onClick={() => handlePage(pagAtual + 1)}>&#62;</button>

                        {pagAtual < ultPag ? (
                            <button onClick={() => handlePage(ultPag)} className="btnPageExtremos"><span>&raquo;</span></button>
                        ) : null}
                    </div>
                ) : null}
            </Fragment>
        );
    }
}