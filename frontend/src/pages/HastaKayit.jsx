import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HastaArama from '../components/HastaArama';
import HastaBilgi from '../components/HastaBilgi';
import PoliklinikSelector from '../components/PoliklinikSelector';
import RandevuList from '../components/RandevuList';
import DemoAlert from '../components/DemoAlert';
import { poliklinikAPI, authAPI } from '../api';
import MenuBar from '../components/MenuBar';
import axios from 'axios';

const HastaKayit = () => {
  const navigate = useNavigate();

  const [selectedHasta, setSelectedHasta] = useState(null);
  const [poliklinikler, setPoliklinikler] = useState([]); 
  const [selectedPoliklinikId, setSelectedPoliklinikId] = useState(''); 
  const [isPoliklinikLoading, setIsPoliklinikLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPoliklinikler = async () => {
      setIsPoliklinikLoading(true);
      setError('');
      try {
        const data = await poliklinikAPI.getTumPoliklinikler();
        setPoliklinikler(data);
      } catch (err) { 
        
        if (err.response) {
          const status = err.response.status;
          if (status === 401) {
            navigate('/401');
          } else if (status === 404) {
            navigate('/404');
          } else {
            alert('Bilinmeyen bir hata oluştu.');
          }
        } else {
          alert('Sunucuya erişilemiyor.');
        }
      } finally {
        setIsPoliklinikLoading(false);
      }
    };
    loadPoliklinikler();
  }, []); 

  const handleHastaSelect = (patient) => {
    setSelectedHasta(patient);
    setSelectedPoliklinikId(''); 
  };

  const handleRandevuSelect = (randevu) => {
    const selectedPoliklinikObject = poliklinikler.find(
      (p) => p.id === parseInt(selectedPoliklinikId, 10)
    );

    if (!selectedPoliklinikObject) {
      setError('Seçili poliklinik bilgisi bulunamadı. Lütfen sayfayı yenileyip tekrar deneyin.');
      return;
    }

    navigate('/randevu/onay', {
      state: {
        randevu,
        hasta: selectedHasta,
        poliklinik: selectedPoliklinikObject,
      },
    });
  };

  const handleYeniHasta = () => {
    navigate('/hastalar/yeni');
  };

  const handleLogout = async () => {
    try {
      const res = await authAPI.logout();
      navigate('/hastakayit/login');
    } catch (error) {
      console.error('Çıkış yapılamadı');
    }
  };

  return (
    <>
      <MenuBar 
      kAdi='' 
      unvan=''
      pAdi='Hasta Kayıt'
      onLogout={handleLogout}
      />
      <div className="container mt-4">
        <h2 className="mb-4">Randevu Rezervasyonu</h2>
        <DemoAlert mesaj=" Arama için isim veya sayı girebilirsiniz."/>
        <HastaArama
          onHastaSelect={handleHastaSelect}
          onYeniHasta={handleYeniHasta}
          setError={setError}
        />

        {selectedHasta && (
          <>
            <HastaBilgi hasta={selectedHasta} />
            <PoliklinikSelector
              poliklinikler={poliklinikler}
              selectedPoliklinikId={selectedPoliklinikId}
              onPoliklinikSelect={setSelectedPoliklinikId}
              isLoading={isPoliklinikLoading}
            />
          </>
        )}

        {selectedPoliklinikId && selectedHasta && (
          <RandevuList
            poliklinikId={selectedPoliklinikId}
            onRandevuSelect={handleRandevuSelect} 
            setError={setError}
          />
        )}

        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
      </div>
    </>
  );
};

export default HastaKayit;
