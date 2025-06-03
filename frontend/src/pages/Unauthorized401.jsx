import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Unauthorized401 = () => {
  const navigate = useNavigate();

  return (
    <Container className="d-flex vh-100">
      <Row className="m-auto text-center align-items-center">
        <Col>
          <h1 className="display-1 fw-bold text-danger">401</h1>
          <h2 className="mb-3">Unauthorized</h2>
          <p className="text-muted">
            Bunu görüntülemeye yetkiniz yok.
          </p>
          <Button variant="primary" onClick={() => navigate("/")}>
            Geri Dön
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Unauthorized401;
