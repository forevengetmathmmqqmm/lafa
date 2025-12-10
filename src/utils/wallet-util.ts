import { ethers } from "ethers";
import QRCodeModal from "@walletconnect/qrcode-modal";
import EthereumProvider, { type EthereumProviderOptions } from "@walletconnect/ethereum-provider";
import { setWalletConnectInstance } from "@/store/slices/walletSlice";
import observeStore from "./observe-store";
const { VITE_INFURA_API_KEY, VITE_WALLET_CONNECT_PROJECT_ID } = import.meta.env;
// 存储WalletConnect实例
let walletConnectInstance: any = null;
const walletConnectOptions:EthereumProviderOptions = {
  projectId: VITE_WALLET_CONNECT_PROJECT_ID as string, // 使用AntDesignWeb3中已有的projectId
  showQrModal: false, // 是否显示内置的 QR Code 模态框
  chains: [11155111], // 连接到以太坊主网
};
// 钱包检测规则对象，包含每个钱包的检测函数
export const WALLET_DETECTION_RULES = {
  "MetaMask": {
    detectFn: () => window.ethereum && window.ethereum.isMetaMask,
    getProvider: async() => new ethers.BrowserProvider(window.ethereum),
  },
  "Trust": {
    detectFn: () => window.trustwallet || (window.ethereum && window.ethereum.isTrust),
    getProvider: async() => new ethers.BrowserProvider(window.ethereum),
  },
  "Coinbase": {
    detectFn: () => window.coinbaseWalletExtension,
    getProvider: async() => new ethers.BrowserProvider(window.coinbaseWalletExtension),
  }, 
  "Rabby": {
    detectFn: () => window.rabby || (window.ethereum && window.ethereum.isRabby),
    getProvider: async() => new ethers.BrowserProvider(window.ethereum),
  },
  "imToken": {
    detectFn: () => window.imToken || (window.ethereum && window.ethereum.isImToken),
    getProvider: async () =>  new ethers.BrowserProvider(window.ethereum),
  },
  "OKX": {
    detectFn: () => window.okxwallet || (window.ethereum && window.ethereum.isOKXWallet),
    getProvider: async() => new ethers.BrowserProvider(window.ethereum),
  },
  "BitKeep": {
    detectFn: () => window.bitkeep || (window.ethereum && window.ethereum.isBitKeep),
    getProvider: async () => new ethers.BrowserProvider(window.ethereum),
  },
  "WalletConnect": {
    detectFn: () => true,
    getProvider: async () => {
      if (walletConnectInstance) {
        await walletConnectInstance.disconnect();
      }
      // 初始化SignClient
      walletConnectInstance = await EthereumProvider.init(walletConnectOptions);
      console.log('======1', walletConnectInstance)
      // 在调用 enable 前监听 pairing URI 事件
      const onDisplayUri = (uri: string) => {
        // provider 会触发 display_uri，拿到 pairing URI
        console.log("display_uri:", uri);
        QRCodeModal.open(uri, () => {
          console.log("QR code closed");
        });
      };
      // 事件名取决于 provider 的实现；通常为 'display_uri'
      walletConnectInstance.on("display_uri", onDisplayUri);
      try {
        const data = await walletConnectInstance.enable();
        QRCodeModal.close();
        console.log('======2', data)
      } catch (error) {
        console.log('======2-1', error)
      }

      observeStore.emit('walletConnectInstance', walletConnectInstance)
      // 创建提供者
      const provider = new ethers.BrowserProvider(walletConnectInstance);
      console.log('===========2-2', provider)
      return provider;
    },
  }
} as const;

export type WalletDetectionRule = (typeof WALLET_DETECTION_RULES)[keyof typeof WALLET_DETECTION_RULES];
// 钱包类型枚举，用于类型安全的钱包检测
export type WalletType = keyof typeof WALLET_DETECTION_RULES;

// 运行时的WalletEnum对象，用于验证和遍历钱包类型
export const WalletEnum = {
  ...Object.fromEntries(Object.keys(WALLET_DETECTION_RULES).map(key => [key, key]))
} as Record<WalletType, WalletType>;

// 2. 定义常见网络的 ID 与原生代币符号的映射表（需根据实际需求补充）
export const chainIdToNativeSymbol: Record<string, string> = {
  "0x1": "ETH",    // 以太坊主网
  "0x89": "MATIC", // Polygon 主网
  "0x38": "BNB",   // BSC 主网
  "0xa4b1": "ARB", // Arbitrum 主网
  "0x13881": "MATIC",// Polygon 测试网（Mumbai）
  "0x539": "LETH", // 本地测试网
  "0xaa36a7": "ETH", // 以太坊测试网（Sepolia）
};
export const defaultChain = {
  chainName: "本地测试网络",
  rpcUrls: [`http://127.0.0.1:8545`],
  nativeCurrency: {
    name: "Matic",
    symbol: chainIdToNativeSymbol['0x539'],
    decimals: 18,
  },
  chainId: "0x539"
}
export type ChainItemType = typeof defaultChain
export const chainConfig: Record<string, ChainItemType> = {
  "0x1": {
    chainName: "以太坊主网",
    rpcUrls: [`https://mainnet.infura.io/v3/${VITE_INFURA_API_KEY}`],
    nativeCurrency: {
      name: "Matic",
      symbol: chainIdToNativeSymbol['0x1'],
      decimals: 18,
    },
    chainId: "0x1"
  },
  "0x539": {
    chainName: "本地测试网络",
    rpcUrls: [`http://127.0.0.1:8545`],
    nativeCurrency: {
      name: "Matic",
      symbol: chainIdToNativeSymbol['0x539'],
      decimals: 18,
    },
    chainId: "0x539"
  },
  "0x13881": {
    chainName: "Polygon 测试网（Mumbai）",
    rpcUrls: [`https://rpc.cardona.zkevm-rpc.com`],
    nativeCurrency: {
      name: "Matic",
      symbol: chainIdToNativeSymbol['0x13881'],
      decimals: 18,
    },
    chainId: "0x13881"
  },
  "0xaa36a7": {
    chainName: "Sepolia测试网",
    rpcUrls: [`https://rpc.sepolia.org`],
    nativeCurrency: {
      name: "ETH",
      symbol: chainIdToNativeSymbol['0xaa36a7'],
      decimals: 18,
    },
    chainId: "0xaa36a7"
  },
}
