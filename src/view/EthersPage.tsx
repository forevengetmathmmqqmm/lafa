import { ethers } from "ethers";
import { useEffect, useState } from "react";
import dataLocalAbi from '@/abi/studentStorage_local.json'
import { Button, Spin } from "antd";
const VITE_MNEMONIC = import.meta.env.VITE_MNEMONIC_KEY

const EthersPage = () => {
  const [blockNumber, setBlockNumber] = useState(0);
  const [balanceNum, setBalanceNum] = useState('');
  const [provider, setProider] = useState<any>(); // 
  const [addressList, setAddressList] = useState<string[]>();
  const [signature, setSignature] = useState<string>('');
  const [signerAddress, setSignerAddress] = useState('');
  const [contract, setContract] = useState<any>();
  const [contractName, setContractName] = useState('');
  const [transactionAddress, setTransactionAddress] = useState('')
  const [spinning, setSpinning] = useState(false)
  useEffect(() => {
    init();
    walletChange();
    // 清理监听器（避免内存泄漏）
    return () => {
      (window as any).ethereum.removeAllListeners('accountsChanged');
      (window as any).ethereum.removeAllListeners('chainChanged');
    };
  }, [])
  const init = async () => {
    // const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545',
      // { chainId: 1337, name: 'localhost'}, );
    // console.log('=======', provider)
    const provider = new (ethers as any).providers.Web3Provider((window as any).ethereum);
    setProider(provider);
    const addr = await provider.listAccounts();
    console.log('====init', addr);
    
  }
  const walletChange = async () => {
    await (window as any).ethereum.on('accountsChanged', (accounts: any) => {
      console.log('======accountsChanged', accounts);
      setAddressList(accounts)
    })
    await (window as any).ethereum.on('chainChanged', (chainId: any) => {
      console.log('======chainId', chainId);
    })
  }
  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    console.log("<<<<<<<", accounts)
    setAddressList(accounts);
  }
  const createWallet = async () => {
    const wallet = ethers.Wallet.createRandom();
    console.log('======wallet', wallet);
    console.log('======wallet address', wallet.address);
    console.log('======wallet mnemonic', wallet.mnemonic.phrase);
    connectWallet()
  }
  // 查询链接的网络
  const getNetwork = async () => {
    const net = await provider.getNetwork()
    console.log('======', net)
  }
  // 获取区块
  const getBlock = async () => {
    const block = await provider.getBlockNumber();
    setBlockNumber(block)
  }
  // 查询余额
  const getBalance = async () => {
    const balance = await provider.getBalance((addressList as any)[0]);
    let data = ethers.utils.formatEther(balance)
    setBalanceNum(data)
  }
  // 签名
  const getSinger = async () => {
    const wallet = ethers.Wallet.fromMnemonic(VITE_MNEMONIC);
    console.log('私钥', wallet.privateKey)
    const message = "Hello, Ethers!";
    const signature = await wallet.signMessage(message);
    setSignature(signature);
  }
  // 验证签名
  const verifySinger = async () => {
    const message = "Hello, Ethers!";
    const signerAddress = ethers.utils.verifyMessage(message, signature);
    setSignerAddress(signerAddress)
  }
  // 链接合约
  const connectConstruct = async (type?: number) => {
    if (type) {
      console.log("======", provider)
      const cAddress = '0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab'
      const contract = new ethers.Contract(cAddress, dataLocalAbi.abi, provider);
      const name = await contract.name();
      setContractName(name);
      setContract(contract);
      return
    }
    const cAddress = '0xBF47AB3720b8a1154f1c8D29eB93597395B5C809'
    // 使用相同的ABI文件，因为它们实际上是同一个文件
    const contract = new ethers.Contract(cAddress, dataLocalAbi.abi, provider);
    // const name = await contract.name();
    // setContractName(name);
    setContract(contract);
  }
  // 部署合约
  const onDeployer = async () => {
    // 部署合约的配置参数
    const deployConfig = {
      privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      ganacheRpcUrl: "http://127.0.0.1:8545" // GUI 默认 7545，CLI 默认 8545
    };
    
    console.log('部署配置已准备:', deployConfig);
    // 这里可以实现合约部署逻辑
  }
  // 调用合约
  const useConstruct = async () => {
    const signer = provider.getSigner();
    const contractWithSigner = contract.connect(signer);
    const data = await contractWithSigner.setStudent('lc', 23)
    console.log('===data===', data)
    const getData = await contract.getStudent();
    console.log('===data===', getData)
  }
  // 发起交易
  const sendTransaction = async () => {
    const signer = provider.getSigner();
    console.log('====addressList', addressList)
    setSpinning(true);
    // 2. 定义交易参数
    const txParams = {
      to: '0x6d2F12a71A8695D70b51B02d83E1E2f0Aab81398', // 接收方地址（必须正确）
      value: ethers.parseEther("100"), // 转账金额（转为 wei 单位，这里是 0.01 ETH）
      // 可选参数
      gasLimit: 21000, // 普通转账固定 21000 gas
      // gasPrice: ethers.parseUnits("30", "gwei") // 手动指定 gas 价格（可选）
    };
    try {
      // 发送交易并获取交易对象
      const tx = await signer.sendTransaction(txParams);
      console.log("交易已发送，哈希:", tx.hash); // 立即获取交易哈希
      setTransactionAddress(tx.hash)
      // 等待交易确认（上链）
      const receipt = await tx.wait();
      setSpinning(false);
      console.log("交易已确认，区块号:", receipt.blockNumber);
      console.log("交易详情:", receipt);
    } catch (error) {
      console.error("交易失败:", error);
    }
  }
  // 切换链
  const changeChain = async () => {
    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }]
      })
      console.log('=========success');

    } catch (error) {
      console.log("======error=", error)
      if ((error as any).code == 4902) {
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x38',
            chainName: 'BNB Smart Chain',
            rpcUrls: ['https://bsc-dataseed.binance.org/'],
            nativeCurrency: { symbol: 'BNB', decimals: 18 },
          }],
        })
      } else {
        console.log("=======")
      }
    }
  }
  return (
    <>
      <Spin spinning={spinning}>
        <div>
          <Button type="link" onClick={connectWallet}>
            链接钱包
          </Button>
          <Button type="link" onClick={createWallet}>
            创建钱包
          </Button>
          <Button type="link" onClick={getNetwork}>
            查询网络
          </Button>
        </div>
        <div>
          <Button type="link" onClick={getBlock}>
            查询区块
          </Button>
          {blockNumber}
        </div>
        <div>
          <Button type="link" onClick={getBalance}>
            查询余额
          </Button>
          {balanceNum}
        </div>
        <div>
          <Button type="link" onClick={getSinger}>
            签名
          </Button>
          {signature}
        </div>
        <div>
          <Button type="link" onClick={verifySinger}>
            验证
          </Button>
          {signerAddress}
        </div>
        <div>
          <Button type="link" onClick={() => onDeployer()}>
            部署本地合约
          </Button>
          <Button type="link" onClick={() => connectConstruct()}>
            链接合约
          </Button>
          <Button type="link" onClick={() => connectConstruct(1)}>
            链接本地合约
          </Button>
          {contractName}
        </div>
        <div>
          <Button type="link" onClick={useConstruct}>
            调用合约
          </Button>
          {signerAddress}
        </div>
        <div>
          <Button type="link" onClick={sendTransaction}>
            发起交易
          </Button>
          {transactionAddress}
        </div>
        <div>
          <Button type="link" onClick={changeChain}>
            切换链
          </Button>
        </div>
      </Spin>
    </>
  )
}

export default EthersPage