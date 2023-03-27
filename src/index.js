import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { PrivateRoute } from './Services/PrivateRoute';
import './index.css';

import Login from './Pages/Login/Login';
import Home from './Pages/Home/Home';

import UsuariosListar from './Pages/Usuarios/Listar';
import UsuariosForm from './Pages/Usuarios/Form';

import LocaisListar from './Pages/Locais/Listar';
import LocaisForm from './Pages/Locais/Form';

import ProblemasListar from './Pages/Problemas/Listar';
import ProblemasForm from './Pages/Problemas/Form';

import Relatorio from './Pages/Relatorio/Relatorio';

import InstitucionalListar from './Pages/Institucional/Listar';
import InstitucionalForm from './Pages/Institucional/Form';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <Switch>
      <Route path="/" exact={true} component={Login} />
      <PrivateRoute path="/home" exact={true} component={Home} />
      <PrivateRoute path="/usuarios" exact={true} component={UsuariosListar} />
      <PrivateRoute path="/usuarios/form" exact={true} component={UsuariosForm} />
      <PrivateRoute path="/locais" exact={true} component={LocaisListar} />
      <PrivateRoute path="/locais/form" exact={true} component={LocaisForm} />
      <PrivateRoute path="/problemas" exact={true} component={ProblemasListar} />
      <PrivateRoute path="/problemas/form" exact={true} component={ProblemasForm} />
      <PrivateRoute path="/relatorio" exact={true} component={Relatorio} />
      <PrivateRoute path="/institucional" exact={true} component={InstitucionalListar} />
      <PrivateRoute path="/institucional/form" exact={true} component={InstitucionalForm} />
    </Switch>
  </BrowserRouter>
);
