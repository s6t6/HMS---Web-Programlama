import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFound404 = () => {
  const navigate = useNavigate();

  return (
    <Container className="d-flex vh-100">
      <Row className="m-auto text-center align-items-center">
        <Col>
          <h1 className="display-1 fw-bold text-warning">404</h1>
          <h2 className="mb-3">Sayfa Bulunamadı</h2>
          <p className="text-muted">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
          <Button variant="primary" onClick={() => navigate(-1)}>
            Geri Dön
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound404;
