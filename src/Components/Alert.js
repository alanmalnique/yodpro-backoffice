import React, { Component, Fragment } from 'react';
import imgErro from '../resources/img/icon-erro.png';
import imgSucesso from '../resources/img/icon-sucesso.png';

export default class Alert extends Component {

    render() {
        const { show, texto, tipo, textoBtn, action } = this.props;
        return (
            <Fragment>
                {show ? (
                    <div style={styles.backdrop}>
                        <div style={styles.content}>
                            <div className="alert">
                                <p className="warning">Atenção</p>
                                <img src={tipo === 1 ? imgSucesso : imgErro} style={{ marginTop: 22 }}
                                    alt={tipo === 1 ? "Imagem de succeso" : "Imagem de erro"} />
                                <p className="description">{texto}</p>
                                <button className="btn alert" onClick={action}>{textoBtn ? textoBtn : 'Ok'}</button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </Fragment>
        );
    }
}

const styles = {
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', width: '100%', height: '100%', display: 'flex', position: 'fixed',
        justifyContent: 'center', alignItems: 'center', zIndex: 3
    },
    content: {
        width: 320, backgroundColor: '#FFF', borderRadius: 5, textAlign: 'center', padding: 21, borderWidth: 1, borderStyle: 'solid',
        borderColor: '#EEE'
    }
};