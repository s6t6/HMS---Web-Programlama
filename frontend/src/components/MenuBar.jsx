import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function MenuBar ({ 
  kAdi, 
  unvan, 
  onLogout = () => {}, 
  pAdi = "Panel",
  ismiGoster = true 
}) {
  const handleLogout = (e) => {
    e.preventDefault();
    onLogout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top">
      <div className="container-fluid">
        {ismiGoster && (
          <div className="navbar-brand fw-bold">
            {pAdi}
          </div>
        )}

        <div className="navbar-text text-light me-auto ms-3">
          <i className="bi bi-person-fill me-2"></i>
          <span className="fw-semibold"> {unvan + " " + kAdi}</span>
          
        </div>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <button 
                className="btn btn-outline-light ms-2"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Çıkış
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;