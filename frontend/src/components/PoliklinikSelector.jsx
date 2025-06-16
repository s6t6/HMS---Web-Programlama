import React from 'react';


const PoliklinikSelector = ({
  poliklinikler,
  selectedPoliklinikId,
  onPoliklinikSelect,
  isLoading
}) => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Adım 2: Poliklinik Seç</h5>
        
        {isLoading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Yükleniyor...</span>
            </div>
          </div>
        ) : (
          <select
            className="form-select"
            value={selectedPoliklinikId}
            onChange={(e) => onPoliklinikSelect(e.target.value)}
            disabled={poliklinikler.length === 0}
          >
            <option value="">Bir poliklinik seçin...</option>
            {poliklinikler.map((poliklinik) => (
              <option key={poliklinik.id} value={poliklinik.id}>
                {poliklinik.ad}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default PoliklinikSelector;
