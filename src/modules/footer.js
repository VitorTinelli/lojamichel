import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import supabase from '../supabase';
import '../index.css'

export default function Footer() {
  const navigate = useNavigate();
  useEffect(() => {
    const CheckLogin = async () => {
      const check = await supabase.auth.getSession();
      if (check.data.session == null) {
          navigate('/');
      }
  }
    CheckLogin();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <footer>
      <p>Developer: Vitor Muneretto Tinelli ©</p>
    </footer>
  )
}