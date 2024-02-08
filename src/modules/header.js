import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import supabase from "../supabase.js"
import baixados from "../sources/baixados.png"

export default function Header() {
    const navigate = useNavigate()
    const [navega, setNavega] = useState(0);

    async function LogOut(e) {
        e.preventDefault();
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.log(error);
        } else {
            navigate('/');
        }
    }

    function openDrawer() {
        if (navega == 0) {
            const nav = document.querySelector('nav');
            nav.classList.add('open');
            setNavega(1)
        }
        if (navega == 1) {
            const nav = document.querySelector('nav');
            nav.classList.remove('open');
            setNavega(0)
        }
    }

    return (
        <header>
            <img src="https://cdn-icons-png.flaticon.com/512/56/56763.png" height={"30dvh"} onClick={openDrawer} className="pointer"></img>
            <nav>
                <div>
                    <ul>
                        <li>
                            <a>Vendas</a>
                        </li>
                        <li onClick={() => navigate('/clientes')}>
                            <a>Clientes</a>
                        </li>
                        <li onClick={() => navigate('/funcionarios')}>
                            <a>Funcionários</a>
                        </li>
                        <li>
                            <a>Recebidos</a>
                        </li>
                        <li>
                            <a>Receber</a>
                        </li>
                        <li onClick={openDrawer}>
                            <a className="buttonActionCancel">Fechar</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <img src={baixados} onClick={() => navigate('/')} className="pointer" />
            <form>
                <div>
                    <input type="submit" onClick={LogOut} value="LogOut" />
                </div>
            </form>
        </header>
    )
}