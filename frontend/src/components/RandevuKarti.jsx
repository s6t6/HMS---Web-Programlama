import React from 'react';

const RandevuKarti = ({ randevu, onSelect }) => {
  
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card h-100">
        <div className="card-body">
          <h6 className="card-title">
            {randevu.doktor_unvan} {randevu.doktor_ad} {randevu.doktor_soyad}
          </h6>
          <p className="card-text">
            <i className="bi bi-calendar me-2"></i>
            {randevu.tarih}
          </p>
          <p className="card-text">
            <i className="bi bi-clock me-2"></i>
            {randevu.saat}
          </p>
          <button
            className="btn btn-primary w-100"
            onClick={() => onSelect(randevu)}
          >
            Randevu Al
          </button>
        </div>
      </div>
    </div>
  );
};

export default RandevuKarti;