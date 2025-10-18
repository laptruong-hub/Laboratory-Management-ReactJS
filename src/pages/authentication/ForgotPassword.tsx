import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  return (
    <div className="forgot-password">
      <h1>Quên mật khẩu</h1>
      <form>
        <div className="form-group">
          <label>Email</label>
          <input type="email" />
        </div>
        <button type="submit">Gửi yêu cầu</button>
      </form>
      <Link to="/auth/login">Quay lại đăng nhập</Link>
    </div>
  );
};

export default ForgotPassword;