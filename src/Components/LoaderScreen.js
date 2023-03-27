import React, { Component, Fragment } from 'react';

import * as Loader from "react-loader-spinner";

export default class LoaderScreen extends Component {

    render() {
        const { show, texto, color, height, width } = this.props;
        const paddingModal = texto ? { padding: '40px 40px 20px 40px' } : { padding: 40 };
        return (
            <Fragment>
                {show ? (
                    <div style={styles.backdrop}>
                        <div style={{...styles.modal, ...paddingModal}}>
                        <Loader.TailSpin
                            color={color ? color : "#3e5074"}
                            height={height ? height : 50}
                            width={width ? width : 50}
                        />
                        {texto ? (
                            <h3 style={styles.text}>{texto}</h3>
                        ) : null}
                    </div>
                    </div>
        ) : null
    }
            </Fragment>
        );
    }
}

const styles = {
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', width: '100%', height: '100%', display: 'flex', position: 'fixed',
        justifyContent: 'center', alignItems: 'center', zIndex: 3
    },
    modal: { backgroundColor: '#FFF', borderRadius: 5, textAlign: 'center' },
    text: { color: '#3E5074', paddingTop: 30 }
};