import React from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <div className="login-form">
      <h1>Đăng nhập</h1>
      <form>
        <div className="form-group">
          <label>Tên đăng nhập</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>Mật khẩu</label>
          <input type="password" />
        </div>
        <button type="submit">Đăng nhập</button>
      </form>
      <Link to="/auth/forgot-password">Quên mật khẩu?</Link>
    </div>
  );
};

export default Login;