import React, { Component, Fragment } from 'react';

import { Redirect } from 'react-router-dom';

export default class RedirectScreen extends Component {

    render() {
        const { redirect, path, props } = this.props;
        return (
            <Fragment>
                {redirect ? (
                    <>
                        {props ? (
                            <Redirect to={{
                                pathname: `${path}`,
                                state: { ...props }
                            }} />
                        ) : (
                                <Redirect to={`${path}`} />
                            )}
                    </>

                ) : null}
            </Fragment>
        );
    }
}