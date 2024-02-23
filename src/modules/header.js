import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase.js";
import baixados from "../sources/baixados.png";
import notificacao from "../sources/notificacao.png";
import snotificacao from "../sources/snotificacao.png";
import "../index.css";

export default function Header() {
    const navigate = useNavigate()
    const [navega, setNavega] = useState(0);
    const navRef = useRef(null);
    const [noNotification, setNoNotification] = useState(true);
    const [anyChange, setAnyChange] = useState(false);

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target) && navega === 1) {
                openDrawer();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [navega]);

    useEffect(() => {
        const fetchNotification = async () => {
            const { data, error } = await supabase
                .from('avisos')
                .select('*')
                .eq('status', false);
            console.log(data)
            if (error) {
                console.error(error);
            } else {
                if (data.length === 0) {
                    setNoNotification(false);
                } else {
                    setNoNotification(true);
                }
                setAnyChange(!anyChange);
            }
        }
        fetchNotification();
        }, [anyChange]);
    return (
        <header>
            <img src="https://cdn-icons-png.flaticon.com/512/56/56763.png" height={"30dvh"} onClick={openDrawer} className="pointer"></img>
            <nav ref={navRef}>
                <div>
                    <ul>
                        <li onClick={() => navigate('/')}>
                            <a>Inicio</a>
                        </li>
                        <li onClick={() => navigate('/clientes')}>
                            <a>Clientes</a>
                        </li>
                        <li onClick={() => navigate('/interesses')}>
                            <a>Interesses</a>
                        </li>
                        <li onClick={openDrawer}>
                            <a><b>Fechar</b></a>
                        </li>
                    </ul>
                </div>
            </nav>
            <img src={baixados} height={'80dvh'} onClick={() => navigate('/')} className="pointer" />
            <form>
                <div>
                    <img src={noNotification ? notificacao : snotificacao} height={noNotification ? '65dvh' : '35dvh'} onClick={() => navigate('/notificacoes')} className="pointer" />
                    <input type="submit" onClick={LogOut} value="LogOut" />
                </div>
            </form>
        </header>
    )
}