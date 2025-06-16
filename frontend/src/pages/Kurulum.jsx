import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Spinner, Alert, Stack, ProgressBar } from 'react-bootstrap';
import { kurulumAPI } from '../api';

const Kurulum = () => {
    const [dbInitialized, setDbInitialized] = useState(false);
    const [dbSeeded, setDbSeeded] = useState(false);
    const [isLoading, setIsLoading] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleInitDb = async () => {
        setIsLoading('init');
        setMessage({ type: '', text: '' });
        try {
            const response = await kurulumAPI.initDb();
            setMessage({ type: 'success', text: response.message });
            setDbInitialized(true);
        } catch (error) {
            setMessage({ type: 'danger', text: error.message });
        } finally {
            setIsLoading(null);
        }
    };

    const handleSeedDb = async () => {
        setIsLoading('seed');
        setMessage({ type: '', text: '' });
        try {
            const response = await kurulumAPI.seedDb();
            setMessage({ type: 'success', text: response.message });
            setDbSeeded(true);
        } catch (error) {
            setMessage({ type: 'danger', text: error.message });
        } finally {
            setIsLoading(null);
        }
    };

    const progress = dbInitialized ? (dbSeeded ? 100 : 50) : 0;

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <Card className="p-4 shadow-sm text-center" style={{ width: '100%', maxWidth: '600px' }}>
                <Card.Body>
                    <Card.Title as="h2" className="mb-4">HMS Kurulum Asistanı</Card.Title>
                    <Card.Text>
                        Uygulamayı ilk kez çalıştırıyorsanız, lütfen aşağıdaki adımları sırayla takip edin.
                    </Card.Text>

                    <ProgressBar animated now={progress} label={`${progress}% Tamamlandı`} className="my-4" />

                    {message.text && <Alert variant={message.type} className="mt-3">{message.text}</Alert>}

                    <Stack gap={3} className="mt-4">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleInitDb}
                            disabled={isLoading !== null || dbInitialized}
                        >
                            {isLoading === 'init' && <Spinner as="span" animation="border" size="sm" className="me-2" />}
                            {dbInitialized ? '✓ Veritabanı Oluşturuldu' : '1. Veritabanını Oluştur'}
                        </Button>

                        {dbInitialized && (
                            <Button
                                variant="info"
                                size="lg"
                                className="text-white"
                                onClick={handleSeedDb}
                                disabled={isLoading !== null || dbSeeded}
                            >
                                {isLoading === 'seed' && <Spinner as="span" animation="border" size="sm" className="me-2" />}
                                {dbSeeded ? '✓ Test Verileri Eklendi' : '2. Veritabanına Test Verisi Ekle'}
                            </Button>
                        )}

                        {dbSeeded && (
                            <div className="mt-4 p-3 bg-light border rounded">
                                <p className="fw-bold">Kurulum Tamamlandı! Portallara Giriş Yapabilirsiniz.</p>
                                <Stack direction="horizontal" gap={3} className="justify-content-center">
                                    <Link to="/doktor/login" className="btn btn-outline-primary">Doktor Girişi</Link>
                                    <Link to="/hastakayit/login" className="btn btn-outline-success">Hasta Kayıt Girişi</Link>
                                </Stack>
                            </div>
                        )}
                    </Stack>
                </Card.Body>
                <Card.Footer className="text-muted">
                    Not: Bu adımlar yalnızca ilk kurulum için gereklidir.
                </Card.Footer>
            </Card>
        </div>
    );
};

export default Kurulum;
