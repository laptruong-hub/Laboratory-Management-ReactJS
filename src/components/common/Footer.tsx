import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Hệ thống quản lý phòng thí nghiệm</p>
      </div>
    </footer>
  );
};

export default Footer;