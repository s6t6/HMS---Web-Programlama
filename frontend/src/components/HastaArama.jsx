import React, { useState } from 'react';
import { hastaAPI } from '../api';

const HastaArama = ({ onHastaSelect, onYeniHasta, setError }) => {
  const [searchId, setSearchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [localError, setLocalError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setIsSearching(true);
    setLocalError('');
    setError('');

    try {
      const results = await hastaAPI.hastaAra(searchId);
      setSearchResults(results);
      
      if (results.length === 0) {
        setLocalError('Bu ID ile hasta bulunamadı');
      }
    } catch (error) {
      console.error('Hasta arama hatası:', error);
      setLocalError('Hasta aranırken hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPatient = (patient) => {
    onHastaSelect(patient);
    setSearchResults([]);
    setSearchId('');
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Adım 1: Hasta Bul</h5>
        
        <form onSubmit={handleSearch}>
          <div className="row g-3">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Vatandaş ID veya Ad Soyad Girin"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                disabled={isSearching}
              />
            </div>
            <div className="col-md-4">
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={isSearching || !searchId.trim()}
              >
                {isSearching ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Aranıyor...
                  </>
                ) : (
                  'Hasta Ara'
                )}
              </button>
            </div>
          </div>
        </form>

        {localError && (
          <div className="alert alert-danger mt-3 mb-0" role="alert">
            {localError}
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mt-3">
            <h6>Arama Sonuçları:</h6>
            <div className="list-group">
              {searchResults.map((patient) => (
                <button
                  key={patient.id}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleSelectPatient(patient)}
                >
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">{patient.ad} {patient.soyad}</h6>
                    <small>ID: {patient.vatandas_id}</small>
                  </div>
                  <p className="mb-1">
                    <small>Yaş: {patient.yas}</small>
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {searchResults.length === 0 && localError && searchId && (
          <div className="mt-3">
            <button 
              className="btn btn-success"
              onClick={onYeniHasta}
            >
              <i className="bi bi-person-plus me-2"></i>
              Yeni Hasta Kaydı
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HastaArama;