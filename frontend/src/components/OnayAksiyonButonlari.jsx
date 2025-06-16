import React from 'react';
import { Button, Spinner } from 'react-bootstrap';

const OnayAksiyonButonlari = ({ onOnayla, onIptal, isLoading }) => {
    return (
        <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" size="lg" onClick={onIptal} disabled={isLoading}>
                <i className="bi bi-x-circle me-2"></i>İptal Et
            </Button>
            <Button variant="success" size="lg" onClick={onOnayla} disabled={isLoading}>
                {isLoading 
                    ? <Spinner as="span" animation="border" size="sm" className="me-2" /> 
                    : <i className="bi bi-check-circle me-2"></i>}
                {isLoading ? 'Onaylanıyor...' : 'Randevuyu Onayla'}
            </Button>
        </div>
    );
};

export default OnayAksiyonButonlari;