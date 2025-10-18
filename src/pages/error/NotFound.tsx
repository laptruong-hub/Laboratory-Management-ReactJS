import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Không tìm thấy trang</p>
      <Link to="/">Về trang chủ</Link>
    </div>
  );
};

export default NotFound;