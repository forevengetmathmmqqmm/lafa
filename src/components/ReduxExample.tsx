import { useState } from 'react';
import { Button, Card, Form, Input, Typography, Space, Divider, Result } from 'antd';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/userSlice';
import { connectWalletStart, connectWalletSuccess, connectWalletFailure, disconnectWallet } from '../store/slices/walletSlice';
import type { RootState } from '../store';

const { Title, Text, Paragraph } = Typography;
const { Item } = Form;

const ReduxExample: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [walletType, setWalletType] = useState('MetaMask');
  const dispatch = useAppDispatch();
  
  // 从 Redux store 中获取状态，确保类型正确
  const userState = useAppSelector((state: RootState) => state.user);
  const walletState = useAppSelector((state: RootState) => state.wallet);

  const handleLogin = async () => {
    dispatch(loginStart());
    
    try {
      // 模拟登录请求延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (username && email) {
        dispatch(loginSuccess({ username, email }));
      } else {
        dispatch(loginFailure('请填写用户名和邮箱'));
      }
    } catch (error) {
      dispatch(loginFailure('登录失败，请重试'));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleConnectWallet = async () => {
    dispatch(connectWalletStart());
    
    try {
      // 模拟钱包连接
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟钱包地址
      const mockAddress = '0x' + Math.random().toString(16).substring(2, 42);
      dispatch(connectWalletSuccess({ 
        address: mockAddress, 
        walletType: walletType 
      }));
    } catch (error) {
      dispatch(connectWalletFailure('钱包连接失败'));
    }
  };

  const handleDisconnectWallet = () => {
    dispatch(disconnectWallet());
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Redux 状态管理示例</Title>
      <Paragraph>这个组件展示了如何在 React 应用中集成和使用 Redux Toolkit 进行状态管理。</Paragraph>
      
      <Divider orientation="left">用户认证状态</Divider>
      
      {userState.isAuthenticated ? (
        <Result
          status="success"
          title="已登录"
          subTitle={`用户名: ${userState.userInfo?.username}, 邮箱: ${userState.userInfo?.email}`}
          extra={[
            <Button type="primary" key="logout" onClick={handleLogout}>
              退出登录
            </Button>,
          ]}
        />
      ) : (
        <Card title="用户登录">
          <Form layout="vertical">
            <Item label="用户名">
              <Input 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="请输入用户名"
              />
            </Item>
            <Item label="邮箱">
              <Input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="请输入邮箱"
              />
            </Item>
            {userState.error && (
              <Text type="danger" style={{ display: 'block', marginBottom: 16 }}>
                {userState.error}
              </Text>
            )}
            <Button 
              type="primary" 
              onClick={handleLogin} 
              loading={userState.loading}
            >
              登录
            </Button>
          </Form>
        </Card>
      )}
      
      <Divider orientation="left">钱包连接状态</Divider>
      
      <Card title="钱包管理">
        <Form layout="vertical">
          <Item label="选择钱包类型">
            <Input 
              value={walletType} 
              onChange={(e) => setWalletType(e.target.value)} 
              placeholder="输入钱包类型 (如 MetaMask)"
            />
          </Item>
          {walletState.error && (
            <Text type="danger" style={{ display: 'block', marginBottom: 16 }}>
              {walletState.error}
            </Text>
          )}
          <Space>
            {!walletState.isConnected ? (
              <Button 
                type="primary" 
                onClick={handleConnectWallet} 
                loading={walletState.loading}
              >
                连接钱包
              </Button>
            ) : (
              <>
                <Result
                  status="success"
                  title="钱包已连接"
                  subTitle={`地址: ${walletState.address?.substring(0, 6)}...${walletState.address?.substring(38)}`}
                  extra={[
                    <Text key="walletType">钱包类型: {walletState.walletType}</Text>,
                    <Button type="primary" key="disconnect" onClick={handleDisconnectWallet}>
                      断开连接
                    </Button>,
                  ]}
                />
              </>
            )}
          </Space>
        </Form>
      </Card>
      
      <Divider orientation="left">Redux Store 状态</Divider>
      <Card title="当前 Redux 状态">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>用户状态:</Text>
            <pre style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 4 }}>
              {JSON.stringify(userState, null, 2)}
            </pre>
          </div>
          <div>
            <Text strong>钱包状态:</Text>
            <pre style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 4 }}>
              {JSON.stringify(walletState, null, 2)}
            </pre>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default ReduxExample;