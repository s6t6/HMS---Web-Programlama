import React from 'react';
import { Alert } from 'react-bootstrap';

const DurumMesaji = ({ hata, basari }) => {
    if (hata) {
        return <Alert variant="danger">{hata}</Alert>;
    }
    if (basari) {
        return <Alert variant="success">{basari}</Alert>;
    }
    return null;
};

export default DurumMesaji;