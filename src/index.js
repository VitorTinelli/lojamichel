import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Home from './Home';
import './index.css';
import Funcionarios from './funcionarios';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import PainelGeral from './painelGeral';
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
        path: '/funcionarios',
        element: <Funcionarios/>,
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)