import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginForm from '../components/LoginForm';
import DemoAlert from '../components/DemoAlert';
import { authAPI, kurulumAPI } from '../api';



function HastaKayitLogin() {
  const [error, setError] = useState('');
  const [demoMesaj, setDemoMesaj] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    setError('');

    try {
      const loginData = {
        k_adi: String(formData.kAdi),
        sifre: String(formData.sifre),
      };
      const res = await authAPI.hastaKayitLogin(loginData);
      
      navigate('/hastakayit', { state: { doktorId: res.doktorId } }); //Düzenle
    } catch (err) {
      setError('Giriş başarısız. Kullanıcı adı veya şifre yanlış.' + err);
    }
  };

  useEffect(() => {
        async function fetchData() {
          try {
          const girisInfo = await kurulumAPI.getHastakayitGirisInfo();
          setDemoMesaj(` Kullanıcı adı: ${girisInfo[0].k_adi}, şifre: ${girisInfo[0].sifre} bilgileri ile giriş yapabilirsiniz.`);
        } catch (error) {
          console.error(error);
        }
        }
        fetchData();
    }, []);

  return (
    <div className="d-flex flex-column align-items-center min-vh-100">
      <DemoAlert mesaj = {demoMesaj}/>
      <div className="d-flex align-items-center justify-content-center min-vh-100">

        <LoginForm
          kullaniciRol="Hasta Kayıt"
          error={error}
          onLogin={handleLogin} />
      </div>
    </div>
  );
}

export default HastaKayitLogin;
