import "./index.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "./supabase";

export default function Home() {
  const [erro, setErro] = useState()
  const [password, setPassword] = useState()
  const [email, setEmail] = useState()

  const navigate = useNavigate()

  async function signInWithEmail() {
    const response = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (response.data.user != null) {
      navigate('/painelGeral')
    } else {
      setErro("Email ou senha incorretos!")
    }

  }

  const CheckLogin = async () => {
    const check = await supabase.auth.getSession();
    if (check.data.session != null) {
      navigate('/painelGeral');
    }
  }
  useEffect(() => {
    CheckLogin();
  }, [])

  return (
    <main className="spacing">
      <>
        <form className="login">
          <h2>Login</h2>
          <div>
            <p>Email</p>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              required
              value={email || ''} onChange={(mail) => setEmail(mail.target.value)}
              className="input"
            />
          </div>
          <div>
            <p>Senha</p>
            <input
              type="password"
              name="senha"
              id="senha"
              placeholder="Senha"
              required
              value={password || ''} onChange={(pass) => setPassword(pass.target.value)}
              className="input"
            />
          </div>
          <input type="button" value="Entrar" onClick={signInWithEmail} className="buttonLogin" />
          {erro}
        </form>
      </>
    </main>
  )
}