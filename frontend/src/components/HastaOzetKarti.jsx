import React from 'react';
import { ListGroup } from 'react-bootstrap';

const HastaOzetKarti = ({ hasta }) => {
    if (!hasta) return null;

    return (
        <>
            <h5 className="mt-4 text-muted">Hasta Bilgileri</h5>
            <ListGroup variant="flush" className="mb-3">
                <ListGroup.Item><strong>Ad Soyad:</strong> {hasta.ad} {hasta.soyad}</ListGroup.Item>
                <ListGroup.Item><strong>Vatandaş ID:</strong> {hasta.vatandas_id}</ListGroup.Item>
            </ListGroup>
        </>
    );
};

export default HastaOzetKarti;