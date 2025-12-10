// 扩展Window接口，添加Web3钱包相关属性
declare interface Window {
  // MetaMask
  ethereum?: any;
  // Trust Wallet
  trustwallet?: any;
  // Coinbase Wallet
  coinbaseWalletExtension?: any;
  // Rabby Wallet
  rabby?: any;
  // imToken
  imToken?: any;
  // OKX Wallet
  okxwallet?: any;
  // BitKeep
  bitkeep?: any;
}

// 为ethereum对象添加类型声明
declare interface Ethereum {
  isMetaMask?: boolean;
  isTrust?: boolean;
  isRabby?: boolean;
  isImToken?: boolean;
  isOKXWallet?: boolean;
  isBitKeep?: boolean;
  request?: (args: any) => Promise<any>;
  on?: (event: string, callback: (...args: any[]) => void) => void;
  removeListener?: (event: string, callback: (...args: any[]) => void) => void;
}

// 确保Window上的ethereum属性使用Ethereum接口类型
declare interface Window {
  ethereum?: Ethereum;
}
