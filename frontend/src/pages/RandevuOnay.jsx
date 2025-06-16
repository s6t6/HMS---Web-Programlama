import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import { randevuAPI } from '../api';

import HastaOzetKarti from '../components/HastaOzetKarti';
import RandevuDetayKarti from '../components/RandevuDetayKarti';
import OnayAksiyonButonlari from '../components/OnayAksiyonButonlari';
import DurumMesaji from '../components/DurumMesaji';

const RandevuOnay = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { randevu, hasta, poliklinik } = location.state || {};

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!randevu || !hasta || !poliklinik) {
            navigate('/hastakayit', { replace: true });
        }
    }, [randevu, hasta, poliklinik, navigate]);

    const handleOnayla = async () => {
        setIsLoading(true);
        setError('');
        setSuccess('');
        try {
            await randevuAPI.randevuOnayla(randevu.id, hasta.id);
            setSuccess('Randevu başarıyla oluşturuldu! Yönlendiriliyorsunuz...');
            setTimeout(() => navigate('/hastakayit', { replace: true }), 3000);
        } catch (err) {
            setError(err.message || 'Randevu onaylanırken bir hata oluştu.');
            setIsLoading(false);
        }
    };

    const handleIptal = () => navigate(-1);

    if (!randevu || !hasta || !poliklinik) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8} lg={7}>
                    <Card className="shadow-lg">
                        <Card.Header as="h2" className="text-center bg-primary text-white p-3">
                            Randevu Onayı
                        </Card.Header>
                        <Card.Body className="p-4">
                            <DurumMesaji basari={success} hata={error} />
                            
                            {!success && (
                                <>
                                    <p className="text-center mb-4">
                                        Lütfen aşağıdaki randevu bilgilerini kontrol edip onaylayınız.
                                    </p>
                                    <HastaOzetKarti hasta={hasta} />
                                    <RandevuDetayKarti randevu={randevu} poliklinik={poliklinik} />
                                    <OnayAksiyonButonlari
                                        onOnayla={handleOnayla}
                                        onIptal={handleIptal}
                                        isLoading={isLoading}
                                    />
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RandevuOnay;