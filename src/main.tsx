import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { AuthProvider } from "./context/AuthContext.tsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // (Bắt buộc phải import CSS)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    { }
    <AuthProvider>
      <App />
      <ToastContainer
        position="top-right" // <-- VỊ TRÍ (Đúng ý bạn)
        autoClose={3000}       // 3 giây tự tắt
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // <-- STYLE "ĐẸP" (Có màu)
      />
    </AuthProvider>
  </StrictMode>
);