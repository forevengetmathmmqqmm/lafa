// 导入Redux Toolkit的createSlice函数
import { createSlice } from '@reduxjs/toolkit';
// 导入PayloadAction类型用于类型安全的action处理
import type { PayloadAction } from '@reduxjs/toolkit';
import type EthereumProvider from "@walletconnect/ethereum-provider";
import type { ethers } from 'ethers';

/**
 * 钱包状态接口定义
 * 用于类型安全的钱包连接状态管理
 * 注意：只存储可序列化的数据
 */
export interface WalletState {
  // 是否已连接钱包
  isConnected: boolean;
  // 钱包地址
  address: string | null;
  // 授权的钱包地址
  approveAddress: string[] | null;
  // 钱包类型（如MetaMask, WalletConnect等）
  walletType: string | null;
  // 钱包余额
  balance: string | null;
  // 加载状态，用于显示加载指示器
  loading: boolean;
  // 错误信息，用于显示错误提示
  error: string | null;
  // 当前连接的链ID
  chainId: string | null;
  // 原生代币符号（如ETH, MATIC等）
  nativeSymbol: string | null;
  walletConnectInstance: EthereumProvider | null
  // 合约实例
  contractInstance: ethers.Contract | null
  // 合约基础数据
  baseContractData: {
    name: string,
    symbol: string,
    balance: string,
  }
}

/**
 * 初始状态定义
 * 设置默认值，确保应用启动时状态一致
 */
const initialState: WalletState = {
  isConnected: false,
  address: null,
  walletType: null,
  balance: null,
  loading: false,
  error: null,
  approveAddress: null,
  chainId: null,
  nativeSymbol: null,
  walletConnectInstance: null,
  contractInstance: null,
  baseContractData: {
    name: "",
    symbol: "",
    balance: ""
  }
};

/**
 * 钱包状态slice
 * 使用createSlice创建包含reducer和action的钱包状态管理模块
 * 处理钱包连接、断开、余额更新等相关操作
 */
const walletSlice = createSlice({
  // slice名称，用于action类型前缀
  name: 'wallet',
  // 初始状态
  initialState,
  // 定义reducer函数，处理状态更新
  reducers: {
    /**
     * 连接钱包开始
     * 设置加载状态，清除之前的错误
     */
    connectWalletStart(state) {
      state.loading = true;
      state.error = null;
    },
    /**
     * 连接钱包成功
     * 更新连接状态，存储钱包地址和类型，清除加载和错误状态
     */
    connectWalletSuccess(state, action: PayloadAction<{ address: string; walletType: string }>) {
      state.isConnected = true;
      state.address = action.payload.address;
      state.walletType = action.payload.walletType;
      state.loading = false;
      state.error = null;
    },
    setIsConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
    /**
     * 连接钱包失败
     * 设置错误信息，清除加载状态
     */
    connectWalletFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    /**
     * 断开钱包连接
     * 重置钱包状态，清除所有连接信息
     */
    disconnectWallet(state) {
      if(state.walletConnectInstance) {
        state.walletConnectInstance.disconnect();
      }
      state.isConnected = false;
      state.address = null;
      state.walletType = null;
      state.balance = null;
      state.error = null;
    },
    /**
     * 更新钱包余额
     * 更新当前连接钱包的余额信息
     */
    updateBalance(state, action: PayloadAction<string>) {
      state.balance = action.payload;
    },
    /**
     * 清除错误
     * 重置错误状态，用于关闭错误提示
     */
    clearError(state) {
      state.error = null;
    },
    /**
     * 设置授权地址
     * 更新当前连接钱包的授权地址
     */
    setApproveAddress(state, action: PayloadAction<string[]>) {
      state.approveAddress = action.payload
    },
    /**
     * 设置地址
     * 更新当前连接钱包的地址
     */
    setAddress(state, action: PayloadAction<string>) {
      state.address = action.payload
    },
    /**
     * 
     * 设置链ID
     * 更新当前连接钱包的链ID
     */
    setChainId(state, action: PayloadAction<string>) {
      state.chainId = action.payload;
    },
    /**
     * 设置原生代币符号
     * 更新当前连接钱包的原生代币符号
     */
    setNativeSymbol(state, action: PayloadAction<string>) {
      state.nativeSymbol = action.payload;
    },
    setWalletConnectInstance(state, action: PayloadAction<EthereumProvider>) {
      state.walletConnectInstance = action.payload;
    },
    setContractInstance(state, action: PayloadAction<ethers.Contract>) {
      // 将 ethers.BaseContract 作为不可变引用存储，避免 Redux Toolkit 的 Immer 深度可变冲突
      state.contractInstance = action.payload as any;
    },
    setBaseContractData(state, action: PayloadAction<{ name: string, symbol: string, balance: string }>) {
      state.baseContractData = action.payload;
    }
  },
});

// 导出所有action creators，用于在组件中触发状态更新
export const {
  connectWalletStart,
  connectWalletSuccess,
  connectWalletFailure,
  disconnectWallet,
  updateBalance,
  clearError,
  setApproveAddress,
  setChainId,
  setNativeSymbol,
  setAddress,
  setWalletConnectInstance,
  setIsConnected,
  setContractInstance,
  setBaseContractData
} = walletSlice.actions;

// 导出reducer作为默认导出，用于在store中组合
export default walletSlice.reducer;