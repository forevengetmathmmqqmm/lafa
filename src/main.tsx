// 导入React严格模式，用于检测潜在问题
import { StrictMode } from 'react'
// 导入ReactDOM的createRoot方法，用于创建应用根节点
import { createRoot } from 'react-dom/client'
// 导入Redux的Provider组件，用于提供全局状态管理
import { Provider } from 'react-redux'
// 导入自定义的Redux store
import { store } from './store'
// 导入全局样式
import './index.css'
// 导入主应用组件
import App from './App.tsx'
// 导入amfe-flexible，用于实现rem适配
import 'amfe-flexible'
// 导入Ant Design Web3配置提供者
import { Web3ConfigProvider } from '@ant-design/web3'
// 导入钱包连接相关组件和提供者
import { Mainnet, MetaMask, WagmiWeb3ConfigProvider, WalletConnect } from '@ant-design/web3-wagmi'
// 导入React Query客户端，用于数据获取和缓存
import { QueryClient } from '@tanstack/react-query';
import { http } from 'wagmi';
// 创建React Query客户端实例
const queryClient = new QueryClient();

// 找到DOM中的root元素并创建React应用根节点
createRoot(document.getElementById('root')!).render(
  // React严格模式，用于检测潜在问题
  <StrictMode>
    {/* Wagmi Web3配置提供者，用于配置钱包连接 */}
    <WagmiWeb3ConfigProvider
    eip6963={{
        autoAddInjectedWallets: true,
      }}
      ens
      chains={[Mainnet]}
      transports={{
        [Mainnet.id]: http(),
      }}
      // 配置支持的钱包列表
      wallets={[
        // 配置MetaMask钱包
        MetaMask(),
        // 配置WalletConnect钱包
        WalletConnect(),
      ]}
      // WalletConnect的配置参数
      walletConnect={{
        // 从环境变量获取WalletConnect项目ID
        projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
      }}
      // 配置React Query客户端
      queryClient={queryClient}>
      {/* Redux提供者，用于提供全局状态 */}
      <Provider store={store}>
        {/* 自定义提供者，可能用于提供其他全局上下文 */}
        <App />
      </Provider>
    </WagmiWeb3ConfigProvider>
  </StrictMode>,
)
