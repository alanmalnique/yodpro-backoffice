import React, { Component, Fragment } from 'react';

export default class Modal extends Component {

    render() {
        const { show, largura, children } = this.props;
        const width = largura ? largura : 320;
        return (
            <Fragment>
                {show ? (
                    <div style={styles.backdrop}>
                        <div style={{ width, backgroundColor: '#FFF', borderRadius: 5, textAlign: 'center', padding: 21, borderWidth: 1, borderStyle: 'solid', borderColor: '#EEE' }}>
                            {children}
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
    }
};