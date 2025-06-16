import { useState } from 'react';

function LoginForm({ kullaniciRol, error, onLogin }) {
    const [kAdi, setKAdi] = useState('');
    const [sifre, setSifre] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        onLogin({ kAdi, sifre });
    };

    return (
        <form 
          className="card p-4 shadow-sm" 
          onSubmit={handleLogin} 
          style={{ minWidth: '350px', maxWidth: '400px' }}>
            <h3 className="text-center mb-4">{kullaniciRol} Girişi</h3>

            <div className="mb-3">
              <label htmlFor="kAdi" className="form-label">Kullanıcı Adı</label>
              <input
                  id="kAdi"
                  type="text"
                  className="form-control"
                  value={kAdi}
                  onChange={(e) => setKAdi(e.target.value)}
                  required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="sifre" className="form-label">Şifre</label>
              <input
                  id="sifre"
                  type="password"
                  className="form-control"
                  value={sifre}
                  onChange={(e) => setSifre(e.target.value)}
                  required
              />
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary w-100 mt-2">Giriş Yap</button>
        </form>
    );
}

export default LoginForm;