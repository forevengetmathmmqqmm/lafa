import { Button, Card, Typography, Space } from 'antd';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

interface CustomConfig {
  appName: string;
  version: string;
  features: string[];
}

const WindowPropertyExample: React.FC = () => {
  const [propertyValue, setPropertyValue] = useState<any>(null);
  const [walletDetected, setWalletDetected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // 检查是否有自定义钱包属性
    if ((window as any).customWallet) {
      setPropertyValue((window as any).customWallet);
    }
    
    // 检测已安装的钱包
    detectWallets();
  }, []);

  const detectWallets = () => {
    const detected: Record<string, boolean> = {};
    
    // 使用我们在window.d.ts中声明的类型
    detected['MetaMask'] = !!window.ethereum?.isMetaMask;
    detected['OKX Wallet'] = !!window.okxwallet || !!window.ethereum?.isOKXWallet;
    detected['Trust Wallet'] = !!window.trustwallet || !!window.ethereum?.isTrust;
    detected['Coinbase'] = !!window.coinbaseWalletExtension;
    detected['Rabby'] = !!window.rabby || !!window.ethereum?.isRabby;
    detected['imToken'] = !!window.imToken || !!window.ethereum?.isImToken;
    detected['BitKeep'] = !!window.bitkeep || !!window.ethereum?.isBitKeep;
    
    setWalletDetected(detected);
  };

  const addStringProperty = () => {
    // 方法1: 使用类型断言添加简单属性
    (window as any).appVersion = '1.0.0';
    setPropertyValue({ type: 'string', key: 'appVersion', value: '1.0.0' });
  };

  const addObjectProperty = () => {
    // 方法2: 添加复杂对象
    const config: CustomConfig = {
      appName: 'Web3App',
      version: '1.0.0',
      features: ['walletConnect', 'tokenSwap', 'nftGallery']
    };
    
    (window as any).appConfig = config;
    setPropertyValue({ type: 'object', key: 'appConfig', value: config });
  };

  const addFunctionProperty = () => {
    // 方法3: 添加函数
    (window as any).showNotification = (message: string) => {
      console.log(`Notification: ${message}`);
      return `显示通知: ${message}`;
    };
    
    setPropertyValue({ 
      type: 'function', 
      key: 'showNotification', 
      value: 'function(message: string) => string'
    });
  };

  const removeProperty = () => {
    // 移除属性
    delete (window as any).customWallet;
    delete (window as any).appVersion;
    delete (window as any).appConfig;
    delete (window as any).showNotification;
    
    setPropertyValue(null);
  };

  const callCustomFunction = () => {
    // 调用动态添加的函数
    if ((window as any).showNotification) {
      const result = (window as any).showNotification('Hello from dynamic function!');
      setPropertyValue({ type: 'functionResult', value: result });
    }
  };

  return (
    <Card title="Window属性操作示例" style={{ margin: 20 }}>
      <Title level={5}>1. 钱包检测状态</Title>
      <Space direction="vertical" style={{ width: '100%', marginBottom: 20 }}>
        {Object.entries(walletDetected).map(([wallet, detected]) => (
          <div key={wallet}>
            {wallet}: <Text mark={detected}>{detected ? '已安装' : '未安装'}</Text>
          </div>
        ))}
      </Space>

      <Title level={5}>2. 动态添加Window属性</Title>
      <Space wrap style={{ marginBottom: 20 }}>
        <Button onClick={addStringProperty}>添加字符串属性</Button>
        <Button onClick={addObjectProperty}>添加对象属性</Button>
        <Button onClick={addFunctionProperty}>添加函数属性</Button>
        <Button onClick={removeProperty} danger>移除所有属性</Button>
        <Button onClick={callCustomFunction} type="dashed">调用自定义函数</Button>
      </Space>

      {propertyValue && (
        <Card title="当前Window属性值" type="inner">
          <pre>{JSON.stringify(propertyValue, null, 2)}</pre>
        </Card>
      )}

      <Title level={5}>3. TypeScript中的Window类型扩展说明</Title>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: '#666' }}>
        <p>• 在TypeScript中，我们通过在<span style={{ color: '#1890ff' }}>src/types/window.d.ts</span>文件中扩展Window接口来添加自定义属性类型</p>
        <p>• 在运行时，我们使用<span style={{ color: '#1890ff' }}>(window as any)</span>类型断言来操作这些属性</p>
        <p>• 对于Web3钱包等全局对象，这种方式既保证了类型安全，又提供了运行时的灵活性</p>
      </div>
    </Card>
  );
};

export default WindowPropertyExample;