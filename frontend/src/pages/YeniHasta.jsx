import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hastaAPI } from '../api';

const YeniHasta = () => {
    const navigate = useNavigate();
    const [hasta, setHasta] = useState({
        vatandas_id: '',
        ad: '',
        soyad: '',
        yas: ''
    });
    const [hata, setHata] = useState('');
    const [basari, setBasari] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHasta(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setHata('');
        setBasari('');

        try {
            const response = await hastaAPI.hastaOlustur(hasta);
            setBasari(`${response.hasta.ad} ${response.hasta.soyad} isimli hasta başarıyla kaydedildi. Yönlendiriliyorsunuz...`);
            setHasta({ vatandas_id: '', ad: '', soyad: '', yas: '' });
            
            setTimeout(() => {
                navigate('/hastakayit');
            }, 2000); 
        } catch (err) {
            setHata(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <h2 className="card-title text-center mb-4">Yeni Hasta Kayıt Formu</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="vatandas_id" className="form-label">Vatandaş ID</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="vatandas_id"
                                        name="vatandas_id"
                                        value={hasta.vatandas_id}
                                        onChange={handleChange}
                                        required
                                        maxLength="5"
                                        pattern="\d{5}"
                                        title="Vatandaş ID 5 haneli bir sayı olmalıdır."
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ad" className="form-label">Ad</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="ad"
                                        name="ad"
                                        value={hasta.ad}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="soyad" className="form-label">Soyad</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="soyad"
                                        name="soyad"
                                        value={hasta.soyad}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="yas" className="form-label">Yaş</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="yas"
                                        name="yas"
                                        value={hasta.yas}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                    />
                                </div>
                                {hata && <div className="alert alert-danger">{hata}</div>}
                                {basari && <div className="alert alert-success">{basari}</div>}
                                <div className="d-flex justify-content-between">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate(-1)} 
                                        disabled={isLoading}
                                    >
                                        Geri
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                        {isLoading ? 'Kaydediliyor...' : 'Hastayı Kaydet'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YeniHasta;