import { useState } from 'react';
import DoktorLogin from './pages/DoktorLogin';

function App() {
  const [doctorId, setDoctorId] = useState(null);
  const [doctorName, setDoctorName] = useState('');

  const handleLogin = (id, name) => {
    setDoctorId(id);
    setDoctorName(name);
  };

  return (
    <>
      {!doctorId ? (
        <DoktorLogin onLogin={handleLogin} />
      ) : (
        <div className="container-fluid">
          <h2>Hoşgeldiniz, Dr. {doctorName}</h2>
        </div>
      )}
    </>
  );
}

export default App;
