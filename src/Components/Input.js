import React, { Component } from 'react';

export default class Input extends Component {

    constructor() {
        super();
        this.state = {
            inputText: ''
        };
    }

    getFile(e) {
        this.setState({ inputText: e[0] ? e[0].name : '' });
    }

    renderInput() {
        const { textHelper, type, label, optionsData, pegaArquivo, multiFiles, divStyle, isFilterGroups, ...otherProps } = this.props;
        if (type === "select") {
            return (
                <div className={ isFilterGroups ? "inputDefault col-xs-12 col-ms-6 col-md-5 col-lg-4":"inputDefault"} style={divStyle}>
                    {label ? (
                        <label>{label}</label>
                    ) : null}
                    <select {...otherProps}>
                        {optionsData.map((item) => {
                            return (
                                <option key={item.value} value={item.value}>{item.text}</option>
                            );
                        })}
                    </select>
                    {textHelper ? (
                        <p style={{ marginTop: -20, marginBottom: 23, color: '#EA5353' }}>* {textHelper}</p>
                    ) : null}
                </div>
            );
        } else if (type === "file") {
            const { inputText } = this.state;
            return (
                <div className={ isFilterGroups ? "inputDefault col-xs-12 col-ms-6 col-md-5 col-lg-4":"inputDefault"} style={divStyle}>
                    {label ? (
                        <label>{label}</label>
                    ) : null}
                    <input type="file" id="selectedFile" onChange={(e) => {
                        this.getFile(e.target.files);
                        pegaArquivo(e.target.files);
                    }} {...otherProps} />
                    <button type="button" onClick={() => document.querySelector(multiFiles ? multiFiles : '#selectedFile').click()} className="btnInput"
                        style={{ minWidth: 460, height: 50, background: '#FFF', borderRadius: 5, padding: '2px 3px', border: '1px solid #DFDFDF' }} >
                        <span style={{ fontSize: 16, lineHeight: '46px', paddingLeft: 10, paddingRight: 10 }}>{inputText}</span>
                        <span style={{ float: 'right', background: '#DDD', padding: '8px 11.3px', borderRadius: 5, fontSize: 24 }}>...</span>
                    </button>
                </div>
            )
        } else if (type === "checkbox") {
            return (
                <>
                    <div className={ isFilterGroups ? "inputDefault col-xs-12 col-ms-6 col-md-5 col-lg-4":"inputDefault"} style={divStyle}>
                        <label style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: '#4F4F4F' }}>
                            <input type="checkbox" style={{ marginRight: 9, marginLeft: 0, /* width: 17, height: 17 */ }} {...otherProps} /> {label}
                        </label>
                        {textHelper ? (
                            <p style={{ marginTop: -20, marginBottom: 23, color: '#EA5353' }}>* {textHelper}</p>
                        ) : null}
                    </div>
                </>
            )
        } else if(type === "text" || type === "tel"){
            return (
                <div className={ isFilterGroups ? "inputDefault col-xs-12 col-ms-6 col-md-5 col-lg-4":"inputDefault"} style={divStyle}>
                    {label ? (
                        <label>{label}</label>
                    ) : null}
                    <input type={type} {...otherProps} />
                    {textHelper ? (
                        <p style={{ marginTop: -20, marginBottom: 23, color: '#EA5353' }}>* {textHelper}</p>
                    ) : null}
                </div>
            );
        }else if(type === "textarea"){
            return (
                <div className={ isFilterGroups ? "inputDefault col-xs-12 col-ms-6 col-md-5 col-lg-4":"inputDefault"} style={divStyle}>
                    {label ? (
                        <label>{label}</label>
                    ) : null}
                    <textarea className="inputTextArea"  rows="8" cols="70" type={type} {...otherProps} />
                    {textHelper ? (
                        <p style={{ marginTop: -20, marginBottom: 23, color: '#EA5353' }}>* {textHelper}</p>
                    ) : null}
                </div>
            );
        }else {
            return (
                <div className={ isFilterGroups ? "inputDefault col-xs-12 col-ms-6 col-md-5 col-lg-4":"inputDefault"} style={divStyle}>
                    {label ? (
                        <label>{label}</label>
                    ) : null}
                    <input type={type} {...otherProps} />
                    {textHelper ? (
                        <p style={{ marginTop: -20, marginBottom: 23, color: '#EA5353' }}>* {textHelper}</p>
                    ) : null}
                </div>
            );
        }
    }

    render() {
        return (
            <>
                {this.renderInput()}
            </>
        );
    }
}