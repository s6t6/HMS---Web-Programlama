import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Tabs, Tab, Table, Button, Container, Pagination } from 'react-bootstrap';
import MenuBar from '../components/MenuBar';
import { authAPI, randevuAPI } from '../api';

function DoktorRandevu() {
  const [data, setData] = useState({ today: [], past: [], future: [] });
  const [currentPage, setCurrentPage] = useState({ today: 1, past: 1, future: 1 });
  const itemsPerPage = 7;
  const location = useLocation();
  const doktorId = location.state?.doktorId;
  const ad = location.state?.ad;
  const unvan = location.state?.unvan;
  console.log(unvan);
  const baseURL = "http://localhost:5000";
  const navigate = useNavigate();


  async function fetchData() {
      try {
        const [todayRes, pastRes, futureRes] = await Promise.all([
          axios.get(`${baseURL}/api/randevu/doktor/${doktorId}/gunluk`, { withCredentials: true}),
          axios.get(`${baseURL}/api/randevu/doktor/${doktorId}/gecmis`, { withCredentials: true}),
          axios.get(`${baseURL}/api/randevu/doktor/${doktorId}/gelecek`, { withCredentials: true}),
        ]);
        setData({
          today: todayRes.data,
          past: pastRes.data,
          future: futureRes.data,
        });
      } catch (error) {
        console.error("Randevu verileri alınamadı:", error);
        
        if (axios.isAxiosError(error) && error.response) {
          const status = error.response.status;
          if (status === 401) {
            navigate('/401');
          } else if (status === 404) {
            navigate('/404');
          } else {
            alert('Bilinmeyen bir hata oluştu.');
          }
        } else {
          alert('Sunucuya erişilemiyor.');
        }
      }
    }
  
  useEffect(() => {
    
    fetchData();
  }, [doktorId]);

  const handleUpdateStatus = async (randevuId, durum) => {
    try {
      const res = await randevuAPI.durumGuncelle(randevuId,durum);
      fetchData();
    } catch (error) {
      console.error('Randevu durumu güncellenemedi:', error);
      alert('Randevu durumu güncellenirken bir hata oluştu.');
    }
  };


  const handleLogout = async () => {
    try {
          const res = await authAPI.logout();
          navigate('/doktor/login');
    } catch (error) {
      console.error('Çıkış yapılamadı');
    }
  }; 


  const paginate = (array, page) => {
    const start = (page - 1) * itemsPerPage;
    return array.slice(start, start + itemsPerPage);
  };

  const renderPagination = (tabKey, totalItems) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const current = currentPage[tabKey];

    if (totalPages <= 1) return null;

    const pages = [];

    pages.push(
      <Pagination.Item
        key={1}
        active={current === 1}
        onClick={() => setCurrentPage({ ...currentPage, [tabKey]: 1 })}
      >
        1
      </Pagination.Item>
    );

    if (current > 3) pages.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);

    for (let i = current - 2; i <= current + 2; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(
          <Pagination.Item
            key={i}
            active={current === i}
            onClick={() => setCurrentPage({ ...currentPage, [tabKey]: i })}
          >
            {i}
          </Pagination.Item>
        );
      }
    }

    if (current < totalPages - 2) pages.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);

    if (totalPages > 1) {
      pages.push(
        <Pagination.Item
          key={totalPages}
          active={current === totalPages}
          onClick={() => setCurrentPage({ ...currentPage, [tabKey]: totalPages })}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return <Pagination className="justify-content-center my-3">{pages}</Pagination>;
  };

  const renderTable = (items, tabKey, showButtons) => (
    <>
      <Table striped bordered hover className="mt-3">
        <thead className="table-dark">
          <tr>
            <th>Ad</th>
            <th>Soyad</th>
            <th>Tarih</th>
            <th>Saat</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {paginate(items, currentPage[tabKey]).map((item, index) => (
            <tr key={index}>
              <td>{item.hasta_ad}</td>
              <td>{item.hasta_soyad}</td>
              <td>{item.tarih}</td>
              <td>{item.saat}</td>
              <td>{item.durum}</td>
              <td>

                <Container className="d-flex">
                  {showButtons && item.durum === 'alindi' && (
                    <>
                      {tabKey === "today" && (
                        <>
                          <Button variant="success" className="m-1 btn-sm" onClick={() => handleUpdateStatus(item.randevu_id, 'tamamlandi')}>Tamamlandı</Button>
                          <Button variant="danger" className="m-1 btn-sm"onClick={() => handleUpdateStatus(item.randevu_id, 'iptal')}>İptal Edildi</Button>
                        </>
                      )}
                      {tabKey === "future" && (
                        <Button variant="danger" className="m-1 btn-sm"onClick={() => handleUpdateStatus(item.randevu_id, 'mevcut')}>İptal Edildi</Button>
                      )}
                    </>
                  )}
                </Container>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {renderPagination(tabKey, items.length)}
    </>
  );

  return (
    <>
    <MenuBar
    kAdi={ad} unvan={unvan} onLogout={handleLogout} pAdi='Doktor Panel'
    ></MenuBar>
    <Container className="d-flex justify-content-center">
      <div className="card shadow rounded-4 w-90" style={{ minWidth: 'min-content' }}>
        <Tabs defaultActiveKey="today" id="uncontrolled-tab-example" className="justify-content-center">
          <Tab eventKey="past" title="Geçmiş">
            {renderTable(data.past, "past", false)}
          </Tab>
          <Tab eventKey="today" title="Bugün">
            {renderTable(data.today, "today", true)}
          </Tab>
          <Tab eventKey="future" title="Gelecek">
            {renderTable(data.future, "future", true)}
          </Tab>
        </Tabs>
      </div>
    </Container>
    </>
  );
}

export default DoktorRandevu;
