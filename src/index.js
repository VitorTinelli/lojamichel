import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Home from './Home';
import './index.css';
import Interesses from './interesses';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import PainelGeral from './painelGeral';
import Clientes from './Clientes';
import Notificacoes from './notificacoes';

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/painelGeral',
        element: <PainelGeral/>,
      },
      {
        path: '/interesses',
        element: <Interesses/>,
      },
      {
        path: '/clientes',
        element: <Clientes/>,
      },
      {
        path: '/notificacoes',
        element: <Notificacoes/>,
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)