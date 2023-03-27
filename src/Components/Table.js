import React, { Component } from 'react';

import iconEditar from '../resources/img/icon-editar.svg';
import iconRelatorio from '../resources/img/icon-relatorio.svg';
import iconVisualizar from '../resources/img/icon-visualizar.svg';

export default class Table extends Component {

    constructor() {
        super();
        this.state = {
            checkboxGeral: false
        }
    }

    selecionaTodos() {
        const { checkboxGeral } = this.state;
        var checkboxes = document.querySelectorAll('input[type="checkbox"]');
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = checkboxGeral ? false : true;
        }
        this.setState({ checkboxGeral: !checkboxGeral });
    }

    render() {
        const { checkboxGeral } = this.state;
        const { campos, dados, selecionavel, validaParcelas, acaoEditar, acaoRelatorio, acaoExtrato, acaoVisualizar, acaoExcluir, acaoSelecionavel, acaoRegras } = this.props;
        const keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        return (
            <table className="table">
                <thead>
                    <tr>
                        {selecionavel ? (
                            <th style={{ width: '5%' }}>
                                <input type="checkbox" className="checkBoxtable" checked={checkboxGeral} onChange={e => {
                                    if (acaoSelecionavel){
                                        this.selecionaTodos()
                                        acaoSelecionavel(e, 1, !checkboxGeral)
                                    }                              
                                }} />
                            </th>
                        ) : null}
                        {campos.map((campo, index) => {
                            return (
                                <th key={keys[index]} style={campo.thStyle}>{campo.titulo}</th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {dados.map((item, index) => {
                        return (
                            <tr key={index}>
                                {selecionavel ? (
                                    validaParcelas ? (
                                        item.tag !== "Pago" ? (
                                            <td><input type="checkbox" className="checkBoxtable" onChange={e => acaoSelecionavel(e)} rel={item['id']} /></td>
                                        ) : (<td></td>)
                                    ) : (<td><input type="checkbox" className="checkBoxtable" rel={item['id']} value={item['valSelect']}
                                        onChange={e => acaoSelecionavel(e, 0)} /></td>)
                                ) : null}
                                {campos.map((campo) => {
                                    if (campo.dado === "tag") {
                                        const val = item[campo.dado];
                                        const splitVal = val.split(' ');
                                        const selectTag = splitVal.length > 1 ? splitVal[1] : splitVal[0];
                                        const arrTags = {
                                            Ativo: { backgroundColor: '#27AE60', color: '#FFFFFF' },
                                            Inativo: { backgroundColor: '#BDBDBD', color: '#FFFFFF' },
                                            Aberto: { backgroundColor: '#27AE60', color: '#FFFFFF' },
                                            Finalizado: { backgroundColor: '#3E4F74', color: '#FFFFFF' },
                                            Pago: { backgroundColor: '#27AE60', color: '#FFFFFF' },
                                            Vencer: { backgroundColor: '#999999', color: '#FFFFFF' },
                                            Vencida: { backgroundColor: '#EB5757', color: '#FFFFFF' },
                                            Cancelado: { backgroundColor: '#EB5757', color: '#FFFFFF' },
                                            Recusado: { backgroundColor: '#BBBABA', color: '#FFFFFF' },
                                            Aprovado: { backgroundColor: '#27AE60', color: '#FFFFFF' },
                                            Pendente: { backgroundColor: '#F3945D', color: '#FFFFFF' },
                                            Reprovado: { backgroundColor: '#EA5353', color: '#FFFFFF' }
                                        }
                                        return (
                                            <td className="tag" style={campo.tdStyle}>
                                                <span style={arrTags[selectTag]}>{val}</span>
                                            </td>
                                        )
                                    } else if (campo.dado === "acoes") {
                                        if (item[campo.dado]) {
                                            const splitValue = item[campo.dado].split('|');
                                            return (
                                                <td className="acoes" style={campo.tdStyle}>
                                                    {splitValue[0] === "default" ? (
                                                        <img src={iconEditar} alt="Ícone editar" style={{ marginRight: 18, cursor: 'pointer' }}
                                                            onClick={() => acaoEditar(item['id'])} />
                                                    ) : null}
                                                    {splitValue[0] === "visualizar" ? (
                                                        <img src={iconVisualizar} alt="Ícone visualizar" style={{ marginRight: 18, cursor: 'pointer' }}
                                                            onClick={() => acaoVisualizar(item['id'])} />
                                                    ) : null}
                                                    {splitValue[1] === "relatorio" ? (
                                                        <img src={iconRelatorio} alt="Ícone relatorio" style={{ marginRight: 18, cursor: 'pointer' }}
                                                            onClick={() => acaoRelatorio(item['id'])} />
                                                    ) : null}
                                                </td>
                                            )
                                        } else {
                                            return (
                                                <td className="acoes" style={campo.tdStyle}></td>
                                            )
                                        }
                                    } else {
                                        return (
                                            <td style={campo.tdStyle}>{item[campo.dado]}</td>
                                        )
                                    }
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        );
    }

}