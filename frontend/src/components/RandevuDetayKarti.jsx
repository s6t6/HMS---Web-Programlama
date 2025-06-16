import React from 'react';
import { ListGroup } from 'react-bootstrap';

const formatTarih = (datetime) => {
    return new Date(datetime).toLocaleDateString('tr-TR', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
    });
};

const formatSaat = (datetime) => {
    return new Date(datetime).toLocaleTimeString('tr-TR', {
        hour: '2-digit', minute: '2-digit'
    });
};

const RandevuDetayKarti = ({ randevu, poliklinik }) => {
    if (!randevu || !poliklinik) return null;

    return (
        <>
            <h5 className="mt-4 text-muted">Randevu Detayları</h5>
            <ListGroup variant="flush">
                <ListGroup.Item><strong>Poliklinik:</strong> {poliklinik.ad}</ListGroup.Item>
                <ListGroup.Item><strong>Doktor:</strong> {randevu.doktor_unvan} {randevu.doktor_ad} {randevu.doktor_soyad}</ListGroup.Item>
                <ListGroup.Item><strong>Tarih:</strong> {formatTarih(randevu.datetime)}</ListGroup.Item>
                <ListGroup.Item><strong>Saat:</strong> {formatSaat(randevu.datetime)}</ListGroup.Item>
            </ListGroup>
        </>
    );
};

export default RandevuDetayKarti;