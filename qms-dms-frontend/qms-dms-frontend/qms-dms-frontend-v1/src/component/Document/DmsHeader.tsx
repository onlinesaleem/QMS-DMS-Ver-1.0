import React from 'react';
import logo from './../../assets/nbcc.png'; // Import your logo image

const DmsHeader: React.FC = () => (
  <header style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
    <img src={logo} alt="Company Logo" style={{ height: '50px', marginRight: '10px' }} />
    <h1>National Blood and Cancer Center</h1>
  </header>
);

export default DmsHeader;