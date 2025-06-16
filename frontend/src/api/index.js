import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});


const handleError = (error, defaultMessage = 'Bir işlem sırasında hata oluştu.') => {
  console.error(defaultMessage, error.response?.data || error.message);
  const errorMessage = error.response?.data?.hata || error.response?.data?.message || defaultMessage;
  const err = new Error(errorMessage);
  err.response = error.response;
  throw err;
};


const apiRequest = async (request, errorMessage) => {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    handleError(error, errorMessage);
  }
};

// Auth API
export const authAPI = {
  doktorLogin: async (credentials) =>
    apiRequest(() => api.post('/auth/doktor-login', credentials), 'Doktor girişi başarısız oldu.'),

  hastaKayitLogin: async (credentials) =>
    apiRequest(() => api.post('/auth/hastakayit-login', credentials), 'Hasta kayıt personeli girişi başarısız oldu.'),

  logout: async () =>
    apiRequest(() => api.post('/auth/logout'), 'Doktor çıkış işlemi başarısız oldu.'),
};

// Hasta API
export const hastaAPI = {
  hastaAra: async (sorgu) =>
    apiRequest(() => api.get(`/hasta/ara/${sorgu}`), 'Hasta arama başarısız oldu.'),

  hastaOlustur: async (hastaData) =>
    apiRequest(() => api.post('/hasta/yeni', hastaData), 'Hasta oluşturma başarısız oldu.'),
};

// Poliklinik API
export const poliklinikAPI = {
  getTumPoliklinikler: async () =>
    apiRequest(() => api.get('/poliklinik/hepsi/'), 'Poliklinikler yüklenemedi.'),
};

// Randevu API
export const randevuAPI = {
  getMevcutRandevular: async (poliklinikId) =>
    apiRequest(() => api.get(`/randevu/mevcut/${poliklinikId}`), 'Mevcut randevular yüklenemedi.'),

  randevuOlustur: async (randevuId, hastaId) =>
    apiRequest(() => api.put(`/randevu/olustur/${randevuId}`, { hasta_id: hastaId }), 'Randevu oluşturma başarısız oldu.'),
  randevuOnayla: async (randevuId, hastaId) =>
    apiRequest(() => api.put(`/randevu/${randevuId}/onayla`, { hasta_id: hastaId }),'Randevu onaylama hatası'),
  durumGuncelle: async (randevuId, durum) =>
    apiRequest(() => api.put(`/randevu/durum-guncelle/${randevuId}`, {durum}), 'Randevu durumu güncellenirken bir hata oluştu.'),
};


// Kurulum API
export const kurulumAPI = {
  initDb: async () => 
    apiRequest(() => api.post('/kurulum/init-db'), 'Veritabanı oluşturulurken bir sunucu hatası oluştu.'),
  seedDb: async () => 
    apiRequest(() => api.post('/kurulum/seed-db'), 'Veritabanına veri eklenirken bir sunucu hatası oluştu.'),
  getDoktorGirisInfo: async () => 
    apiRequest(() => api.get('/kurulum/demo/doktor/girisInfo'), 'Demo için giriş bilgileri çekilirken bir sorun oluştu.'),
  getHastakayitGirisInfo: async () => 
    apiRequest(() => api.get('/kurulum/demo/hastakayit/girisInfo'), 'Demo için giriş bilgileri çekilirken bir sorun oluştu.'),
};