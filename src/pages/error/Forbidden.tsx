import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden: React.FC = () => {
  return (
    <div className="forbidden">
      <h1>403</h1>
      <p>Bạn không có quyền truy cập trang này</p>
      <Link to="/">Về trang chủ</Link>
    </div>
  );
};

export default Forbidden;