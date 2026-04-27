import { ConfigProvider, App as AntdApp } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import './app/styles/index.css';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff', // Màu thương hiệu cho hệ thống quản lý sân bóng
          borderRadius: 6,
        },
      }}
    >
      <AntdApp>
        <BrowserRouter>
          {/* Router sẽ được render ở đây */}
          <div style={{ padding: '20px' }}>
            <h1>Football Management System - FSD Architecture</h1>
            <p>Cấu trúc thư mục và Model dữ liệu đã sẵn sàng.</p>
          </div>
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
