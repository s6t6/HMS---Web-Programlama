import React from 'react';

const DemoAlert = ({mesaj}) => {
  return (
    <div className="alert alert-info alert-dismissible fade show mb-4" role="alert">
      <strong>Demo Modu:</strong> 
      <span className="fw-semibold">{String(mesaj)}</span>
      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  );
};

export default DemoAlert;