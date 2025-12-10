import { Modal, Button, List, Avatar, Input, message } from "antd";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { WALLET_DETECTION_RULES } from "@/utils/wallet-util";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useProviderHook, useUpdateBalance } from "@/utils/hooks.tsx";
import { ethers } from "ethers";
import type { RootState } from "@/store";
import { transactionEnum, type transactionItem } from "@/utils/comment";
interface WalletInfo {
  name: string
  detected: boolean
  connectMethod: () => Promise<ethers.BrowserProvider>
}
type TransType = 1 | 2 | 3 | 4
interface TransactionCoinProps {
  getTransactionList: () => void,
}
const TransactionCoin = forwardRef((props: TransactionCoinProps, ref) => {
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);
  const walletState = useAppSelector((state: RootState) => state.wallet);
  const dispatch = useAppDispatch();
  const { provider } = useProviderHook();
  const [open, setOpen] = useState(false);
  const [sendAddress, setSendAddress] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [sendNum, setSendNum] = useState('');
  const [transType, setTransType] = useState<TransType>(1) // 1 币交易， 2 合约币交易
  const updateBalanceHook = useUpdateBalance();
  const [transactionObj, setTransactionObj] = useState<transactionItem>({} as transactionItem)
  // 暴露open方法给父组件
  useImperativeHandle(ref, () => ({
    setOpen: changeOpen
  }));
  const changeOpen = (val: boolean, type: TransType) => {
    setOpen(val);
    setTransactionObj(transactionEnum[type])
    setTransType(type);
  }
  useEffect(() => {
    if (!walletState.isConnected) {
      detectWallets();
    }
  }, [walletState.isConnected]);

  const detectWallets = () => {
    const wallets: WalletInfo[] = [];
    Object.entries(WALLET_DETECTION_RULES).forEach(([name, walletItem]) => {
      try {
        const detected = walletItem.detectFn() as boolean;
        if (detected) {
          wallets.push({
            name,
            detected,
            connectMethod: walletItem.getProvider
          });
        }
      } catch (error) {
        console.error(`检测${name}钱包时出错:`, error);
      }
    });

    setAvailableWallets(wallets);
  };
  const sendTransaction = async () => {
    if(transType == 1) {
      sendCoin()
    } else if (transType == 4) {
      approveTransaction()
    } else if (transType == 3) {
      transferFrom()
    } else {
      sendContractCoin()
    }
  }
  const sendCoin = async () => {
    if (!sendAddress || !sendNum || !provider) {
      return;
    }
    const signer = await provider.getSigner();
    // 2. 定义交易参数
    const txParams = {
      to: sendAddress, // 接收方地址（必须正确）
      value: ethers.parseEther(sendNum), // 转账金额（转为 wei 单位，这里是 0.01 ETH）
      // 可选参数
      gasLimit: 21000, // 普通转账固定 21000 gas
      gasPrice: ethers.parseUnits("30", "gwei") // 手动指定 gas 价格（可选）
    };
    try {
      // 发送交易并获取交易对象
      const tx = await signer.sendTransaction(txParams);
      console.log("交易已发送，哈希:", tx.hash); // 立即获取交易哈希
      // 等待交易确认（上链）
      const receipt = await tx.wait();
      if (receipt) {
        console.log("交易已确认，区块号:", receipt.blockNumber);
      } else {
        console.warn("交易回执为 null，可能未成功上链");
      }
      console.log("交易详情:", receipt);
      message.success('交易成功');
      await updateBalanceHook();
      await props.getTransactionList();
      setOpen(false);
    } catch (error) {
      console.error("交易失败:", error);
    }
  }
  const sendContractCoin = async () => {
    const contractIn = walletState.contractInstance
    if (!contractIn) {
      return;
    }
    const t = await contractIn.transfer(sendAddress, ethers.parseEther(sendNum));
    console.log('=====t', t)
    await props.getTransactionList();
    setOpen(false)
  }
  const approveTransaction = async () => {
    const contractIn = walletState.contractInstance
    if (!contractIn) {
      return;
    }
    const t = await contractIn.approve(sendAddress, ethers.parseEther(sendNum));
    console.log('=====t', t)
    await props.getTransactionList();
    setOpen(false)
  }
  const transferFrom = async () => {
    const contractIn = walletState.contractInstance
    if (!contractIn) {
      return;
    }
    const balanceData =  await contractIn.allowance(fromAddress, walletState.address)
    console.log('=====balanceData', balanceData)
    const t = await contractIn.transferFrom(fromAddress, sendAddress, ethers.parseEther(sendNum));
    console.log('=====t', t)
    await props.getTransactionList();
    setOpen(false)
  }

  return (
    <Modal
      title="发送"
      open={open}
      footer={null}
      closable={true}
      onCancel={() => setOpen(false)}
      maskClosable={false}
    >
      <div className="flex flex-col items-center">
        <div className="text-sm text-gray-500">{ transactionObj?.label }</div>
        <Avatar shape='square' size={40}>{ transType === 1 ? walletState.nativeSymbol : walletState.baseContractData?.symbol}</Avatar>
        <div className="text-sm text-gray-500">{ transType === 1 ? walletState.nativeSymbol : walletState.baseContractData?.symbol}</div>
        {
          transactionObj?.value == 3 &&
          <Input value={fromAddress} onInput={(val: React.ChangeEvent<HTMLInputElement>) => { setFromAddress(val.target.value) }} />
        }
        <div className="mr-auto">{ transactionObj?.value == 4 ? '授权' : '转账' } 至</div>
        <Input value={sendAddress} onInput={(val: React.ChangeEvent<HTMLInputElement>) => { setSendAddress(val.target.value) }} />
        <div className="mr-auto mt-[20px]">数额</div>
        <Input value={sendNum} onInput={(val: React.ChangeEvent<HTMLInputElement>) => { setSendNum(val.target.value) }} />
        <Button type="primary" className="mt-[20px]" onClick={() => { sendTransaction() }}>发送</Button>
      </div>

    </Modal>
  );
})

export default TransactionCoin