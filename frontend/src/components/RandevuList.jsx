import React, { useState, useEffect, useMemo } from 'react';
import { randevuAPI } from '../api';
import RandevuKarti from './RandevuKarti';
import { Accordion, Spinner, Alert } from 'react-bootstrap';

const RandevuList = ({ poliklinikId, onRandevuSelect, setError }) => {
  const [randevular, setRandevular] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (poliklinikId) {
      const loadRandevular = async () => {
        setIsLoading(true);
        setError('');
        try {
          const data = await randevuAPI.getMevcutRandevular(poliklinikId);
          setRandevular(data);
        } catch (error) {
          console.error('Randevu yükleme hatası:', error);
          setError('Randevular yüklenirken bir hata oluştu.');
        } finally {
          setIsLoading(false);
        }
      };
      loadRandevular();
    }
  }, [poliklinikId, setError]);

  const gruplanmisRandevular = useMemo(() => {
    return randevular.reduce((acc, randevu) => {
      const tarih = randevu.datetime.split('T')[0]; // Sadece tarih kısmını al (YYYY-MM-DD)
      if (!acc[tarih]) {
        acc[tarih] = [];
      }
      acc[tarih].push(randevu);
      return acc;
    }, {});
  }, [randevular]);

  // Tarih başlığını formatlamak için yardımcı fonksiyon
  const formatTarihBasligi = (tarihStr) => {
    const tarih = new Date(tarihStr);
    return new Intl.DateTimeFormat('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(tarih);
  };

  if (isLoading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </Spinner>
      </div>
    );
  }

  const tarihAnahtarlari = Object.keys(gruplanmisRandevular);

  if (tarihAnahtarlari.length === 0) {
    return (
      <div className="alert alert-info mt-3" role="alert">
        Bu poliklinik için müsait randevu bulunmuyor.
      </div>
    );
  }

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Adım 3: Müsait Randevulardan Birini Seçin</h5>
        <Accordion defaultActiveKey="0" alwaysOpen>
          {tarihAnahtarlari.map((tarih, index) => (
            <Accordion.Item eventKey={String(index)} key={tarih}>
              <Accordion.Header>
                <strong>{formatTarihBasligi(tarih)}</strong>
                <span className="badge bg-primary ms-2">{gruplanmisRandevular[tarih].length} müsait</span>
              </Accordion.Header>
              <Accordion.Body>
                <div className="row g-3">
                  {gruplanmisRandevular[tarih].map((randevu) => (
                    <RandevuKarti
                      key={randevu.id}
                      randevu={randevu}
                      onSelect={onRandevuSelect}
                    />
                  ))}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default RandevuList;