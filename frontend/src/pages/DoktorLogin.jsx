import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginForm from '../components/LoginForm';
import { authAPI, kurulumAPI } from '../api';
import DemoAlert from '../components/DemoAlert';



function DoktorLogin() {
  const [error, setError] = useState('');
  const [demoMesaj, setDemoMesaj] = useState('');
  const navigate = useNavigate();

  const handleDoktorLogin = async (formData) => {
    setError('');

    try {
      const loginData = {
        k_adi: String(formData.kAdi),
        sifre: String(formData.sifre),
      };
      const res = await authAPI.doktorLogin(loginData);

      navigate('/randevular', { state: { doktorId: res.doktorId, ad: res.ad, unvan: res.unvan } });
    } catch (err) {
      setError('Giriş başarısız. Kullanıcı adı veya şifre yanlış.' + err);
    }
  };

  useEffect(() => {
      async function fetchData() {
        try {
        const girisInfo = await kurulumAPI.getDoktorGirisInfo();
        setDemoMesaj(` Kullanıcı adı: ${girisInfo[0].k_adi}, şifre: ${girisInfo[0].sifre} bilgileri ile giriş yapabilirsiniz.`);
      } catch (error) {
        console.error(error);
      }
      }
      fetchData();
  }, []);

  console.log('demo:'+ demoMesaj);
  return (
    <div className="d-flex flex-column align-items-center min-vh-100">
      <DemoAlert mesaj = {demoMesaj}/>
      <div className="d-flex align-items-center justify-content-center min-vh-100">

        <LoginForm
          kullaniciRol="Doktor"
          error={error}
          onLogin={handleDoktorLogin} />
      </div>
    </div>
  );
}

export default DoktorLogin;
