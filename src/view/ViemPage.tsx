import { ethers } from "ethers";
import { useEffect, useState } from "react";
import dataAbi from '@/abi/studentStorage_local.json'
import dataLocalAbi from '@/abi/studentStorage_local.json'
import dataTokenAbi from '@/abi/MyERC20Token.json'
import { Button, Spin } from "antd";
import { createPublicClient, createWalletClient, custom, formatUnits, getContract, parseEther } from "viem";
// import { mainnet } from "viem/chains"; // 暂时注释，未使用
import { Address } from "@ant-design/web3";
const VITE_TOKEN_CONSTRUCT_ADDRESS = import.meta.env.VITE_TOKEN_CONSTRUCT_ADDRESS
// const VITE_INFURA_API_KEY = import.meta.env.VITE_INFURA_API_KEY // 暂时注释，未使用

const localChain = {
  id: 1337,
  name: 'Local Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['http://localhost:8545'] } } // 本地节点地址
}
const ViemPage = () => {
  const [blockNumber, setBlockNumber] = useState(0);
  const [balanceNum, setBalanceNum] = useState('');
  // provider 连接器
  const [viemProvider, setViemProider] = useState<any>(); // 
  const [addressList, setAddressList] = useState<string[]>();
  const [signature, setSignature] = useState<string>('');
  const [signerAddress] = useState('');
  const [contract, setContract] = useState<any>();
  const [transactionAddress, setTransactionAddress] = useState('')
  const [spinning, setSpinning] = useState(false);
  const [cType, setCType] = useState<'1' | '2' | ''>('1');
  // token 余额信息
  const [tokenBalancInfo, setTokenBalanceInfo] = useState<any>({});
  // 链 id
  const [chainId, setChainId] = useState('');
  // 钱包客户端
  const [walletClient, setWalletClient] = useState<any>();
  useEffect(() => {
    const viemProvider = createPublicClient({
      chain: localChain,
      transport: custom((window as any).ethereum),
      pollingInterval: 100
    })
    watchContractToken(viemProvider);
    setViemProider(viemProvider);
  }, [])
  const watchContractToken = async (viemProvider: any) => {
    const block = await viemProvider.getBlockNumber();
    let watchArgs = {
      address: VITE_TOKEN_CONSTRUCT_ADDRESS,
      abi: dataTokenAbi.abi,
      eventName: 'Transfer',
      fromBlock: block
    }
    viemProvider.watchContractEvent(watchArgs, (args: any, event: any) => {
      console.log('args=====', args, event);
    })
    console.log(`开始监听 ${VITE_TOKEN_CONSTRUCT_ADDRESS} 的Transfer事件`);
  }
  // 链接钱包，获取账户地址
  const connectWallet = async () => {
    const walletClient = createWalletClient({
      chain: localChain,
      transport: custom((window as any).ethereum)
    })
    setWalletClient(walletClient)
    const chainId = await walletClient.getChainId();
    console.log("chainId", chainId)
    const addressList = await walletClient.getAddresses();
    setAddressList(addressList);
  }
  const creatWallet = async () => {
    const account = await walletClient.createAccount();
    console.log('======account', account);
  }
  // 查询链接的网络
  const getNetwork = async () => {
    const chainId = await viemProvider.getChainId();
    setChainId(chainId);
  }
  // 获取区块
  const getBlock = async () => {
    const block = await viemProvider.getBlockNumber();
    setBlockNumber(block)
  }
  // 查询余额
  const getBalance = async () => {
    const balance = await viemProvider.getBalance({
    address: (addressList as any)[0]
    });
    let data = ethers.utils.formatEther(balance)
    setBalanceNum(data)
  }
  // 签名
  const getSinger = async () => {
    const signature = await walletClient.signMessage({
      account: addressList?.[0],
      message: '测试 web3singer'
    });
    setSignature(signature);
  }
  /**
   * 链接合约
   * @param type 1 本地合约 2 ERC20合约
   */
  const connectConstruct = async (type?: number) => {
    let cAddress = import.meta.env.VITE_STUDENT_ETH_CONSTRUCT_ADDRESS as any;
    let abi = dataAbi.abi;
    if (type == 1) {
      setCType('1')
      cAddress = import.meta.env.VITE_STUDENT_CONSTRUCT_ADDRESS;
      abi = dataLocalAbi.abi;
    } else if (type == 2) {
      cAddress = import.meta.env.VITE_TOKEN_CONSTRUCT_ADDRESS;
      abi = dataTokenAbi.abi as any;
      setCType('2')
    } else {
      setCType('')
    }
    const contract = getContract({
      address: cAddress,
      abi: abi,
      client: {
        public: viemProvider,
        wallet: walletClient
      }
    });
    setContract(contract);
  }
  // 调用合约
  const useConstruct = async () => {
    setSpinning(true)
    const data = await contract.write.setStudent(['lc', 23], {
      account: addressList?.[0]
    })
    console.log('===data===', data)
    const getData = await contract.read.getStudent();
    console.log('===data===', getData)
    setSpinning(false)
  }
  // 调用 token 合约
  const useConstructTransfer = async () => {
    console.log('=====walletClient', walletClient, addressList?.[1]);
    const hash = await walletClient.writeContract({
      address: import.meta.env.VITE_TOKEN_CONSTRUCT_ADDRESS,
      abi: dataTokenAbi.abi,
      functionName: 'transfer',
      account: addressList?.[0],
      args: [
        addressList?.[1],        // 接收地址
        parseEther(Number(100).toString())  // 转账数量（已转换为最小单位）
      ]
    })
    console.log('======hash', hash);
    const recipt = await viemProvider.waitForTransactionReceipt({ hash });
    console.log('=====recipt',recipt);
    
  }
  const getTokenBalance = async () => {
    const [ balance, decimals,  name, symbol ] = await Promise.all([viemProvider.readContract({
      address: import.meta.env.VITE_TOKEN_CONSTRUCT_ADDRESS,
      abi: dataTokenAbi.abi,
      functionName: 'balanceOf',
      args: [
        addressList?.[1],        // 接收地址
      ]
    }),viemProvider.readContract({
      address: import.meta.env.VITE_TOKEN_CONSTRUCT_ADDRESS,
      abi: dataTokenAbi.abi,
      functionName: 'decimals',
      args: []
    }), viemProvider.readContract({
      address: import.meta.env.VITE_TOKEN_CONSTRUCT_ADDRESS,
      abi: dataTokenAbi.abi,
      functionName: 'name',
      args: []
    }),viemProvider.readContract({
      address: import.meta.env.VITE_TOKEN_CONSTRUCT_ADDRESS,
      abi: dataTokenAbi.abi,
      functionName: 'symbol',
      args: []
    }) ])
    
    console.log('=====', formatUnits(balance, decimals), name, symbol);
    setTokenBalanceInfo({
      balance: formatUnits(balance, decimals),
      name,
      symbol
    })
  }
  // 发起交易
  const sendTransaction = async () => {
    setSpinning(true);
    console.log('====', addressList)
    const hash = await walletClient.sendTransaction({ 
      account: addressList?.[1],
      to: addressList?.[0],
      value: parseEther('100'),
    })
    setSpinning(false);
    setTransactionAddress(hash)

  }
  return (
    <>
      <Spin spinning={spinning}>
        <div>
          <Button type="link" onClick={connectWallet}>
            链接钱包
          </Button>
          <Button type="link" onClick={creatWallet}>
            创建钱包
          </Button>
          <span>钱包地址:{
            addressList?.map(item => <span key={item}><Address ellipsis tooltip address={ item }></Address>,</span>)
          }</span>
        </div>
        <div>
          <Button type="link" onClick={getNetwork}>查询网络</Button>
          <span>链id:{ chainId }</span>
        </div>
        <div>
          <Button type="link" onClick={getBlock}>
            查询区块
          </Button>
          <span>当前区块: {blockNumber}</span>
        </div>
        <div>
          <Button type="link" onClick={getBalance}>
            查询余额
          </Button>
          <span>当前账户余额： {balanceNum}</span>
        </div>
        <div>
          <Button type="link" onClick={getSinger}>
            签名
          </Button>
          <span>签名 hash地址:{signature}</span>
        </div>
        <div>
          <Button type="link" onClick={() => connectConstruct()}>
            链接合约
          </Button>
          <Button type="link" onClick={() => connectConstruct(1)}>
            链接本地合约
          </Button>
          <Button type="link" onClick={() => connectConstruct(2)}>
            链接ERC20本地合约
          </Button>
          <span>{cType == '1' ? '当前是本地合约' : cType == '2' ? '当前是本地ERC20合约' : '当前是以太坊测试链合约'} ： 合约地址{contract?.address}</span>
        </div>
        <div>
          <Button type="link" onClick={useConstruct}>
            调用合约
          </Button>
          <Button type="link" onClick={useConstructTransfer}>
            调用transfer合约
          </Button>
          {signerAddress}
        </div>
        <div>
          <Button type="link" onClick={sendTransaction}>
            发起交易
          </Button>
          <span>交易的 hash 地址：{transactionAddress}</span>
        </div>
        <div>
          <Button type="link" onClick={getTokenBalance}>
            查询 token 余额
          </Button>
          <span>拥有{tokenBalancInfo.name}代币{tokenBalancInfo.balance}{ tokenBalancInfo.symbol}</span>
        </div>
      </Spin>
    </>
  )
}

export default ViemPage