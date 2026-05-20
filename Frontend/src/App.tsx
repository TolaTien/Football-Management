import { ConfigProvider, App as AntdApp } from 'antd';
import viVN from 'antd/locale/vi_VN';

function App() {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#1890ff', // Màu thương hiệu cho hệ thống quản lý sân bóng
          borderRadius: 6,
        },
      }}
    >
      <AntdApp>
        {/* Router sẽ được render ở đây */}
        <div style={{ padding: '20px' }}>
          <h1>Football Management System - FSD Architecture</h1>
          <p>Cấu trúc thư mục và Model dữ liệu đã sẵn sàng.</p>
        </div>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
