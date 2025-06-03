import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


// TODO: sayfayı ortala

function DoktorLogin({ onLogin = () => {} }) {
  const [kAdi, setKAdi] = useState('');
  const [sifre, setSifre] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/doktor-login', {
        k_adi: kAdi,
        sifre: sifre,
      }, {withCredentials: true});

      onLogin(res.data.doktorId, res.data.ad);
      navigate('/randevular', { state: { doktorId: res.data.doktorId } }, {withCredentials: true});
    } catch (err) {
      setError('Giriş başarısız. Kullanıcı adı veya şifre yanlış.' + err);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row vertical-center">
        <form className="col-xs-8 col-xs-offset-2 col-sm-6 col-sm-offset-3 col-md-4 col-sm-offset-4 col-lg-2 col-lg-offset-5" onSubmit={handleLogin}>
          <h3>Doktor Girişi</h3>

          <label className="sr-only">Kullanıcı Adı</label>
          <input
            type="text"
            className="form-control"
            value={kAdi}
            onChange={(e) => setKAdi(e.target.value)}
            required
          />

          <label className="sr-only">Şifre</label>
          <input
            type="password"
            className="form-control"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
            required
          />

          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">Giriş Yap</button>
        </form>
      </div>
    </div>
  );
}

export default DoktorLogin;
