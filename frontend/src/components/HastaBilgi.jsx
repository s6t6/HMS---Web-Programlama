import React from 'react';

const HastaBilgi = ({ hasta }) => {
  return (
    <div className="card mb-4 border-primary">
      <div className="card-body">
        <h6 className="card-subtitle mb-2 text-muted">Seçili Hasta</h6>
        <h5 className="card-title">{hasta.ad} {hasta.soyad}</h5>
        <p className="card-text">
          Vatandaş ID: {hasta.vatandas_id} | Yaş: {hasta.yas}
        </p>
      </div>
    </div>
  );
};

export default HastaBilgi;