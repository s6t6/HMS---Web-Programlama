# HMS (Hastane Yönetim Sistemi)

2024 - 2025 dönemi Web Programlama dersi projesi için hazırlanmıştır.

## Tech Stack

### Frontend
- React + Vite
- React Router DOM
- Bootstrap
- Axios

### Backend
- Node.js
- Express
- CORS
- Body-parser
- Better-SQLite3

## Başlarken

### Seçenek 1: Docker ile Kurulum

```bash
docker-compose up --build
```
WSL ve Docker uygulamasının kurulu ve çalışıyor olması lazım.

### Seçenek 2: Manuel Kurulum (Docker Başarısız Olursa)

1. Backend dizinine gidin:

```bash
cd backend
```
2. Bağımlılıkları yükleyin:
```bash
npm install
```
3. better-sqlite3 ile sorun yaşarsanız, şunu deneyin:
```bash
npm rebuild better-sqlite3
```
4. Backend sunucusunu başlatın:
```bash
node index.js
```
Backend artık http://localhost:5000 adresinde çalışıyor olmalı

### Frontend Kurulumu
1. Yeni bir terminal açın ve frontend dizinine gidin:
```bash
cd frontend
```
2. Bağımlılıkları yükleyin:
```bash
npm install
```
3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```
Frontend artık http://localhost:5174 adresinde çalışıyor olmalı

### Database Init

İlk kullanımda backend klasöründe hms.db dosyası bulunmayabilir. Eğer yoksa backend dizinindeyken init-db.js scriptini çalıştırın:
```bash
node .\index.js
```
Ardından test sorguları için data yüklemek isterseniz mock-data.js scriptini çalıştırın:
```bash
node .\mock-data.js
```