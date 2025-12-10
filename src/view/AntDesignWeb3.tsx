import { useProvider } from "@ant-design/web3"
import { useEffect } from "react";
const AntDesignWeb3 = () => {
  const { connect, account, availableWallets, disconnect } = useProvider();
  // const [accounts, setAccounts] = useStte<any>(); // 暂时注释，未使用
  useEffect(() => {
    init();
  }, [])
  useEffect(() => {
    console.log('======account', account);

  }, [JSON.stringify(account)])
  const init = async () => {
    try {
      const data = await connect?.(availableWallets?.[0]);
      console.log('======connect', data);
    } catch (error) {
      console.log('======connect error', error);
    }
    // const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
    // console.log('====', accounts);
  }
  return <div className="w-screen h-screen flex justify-center">
    <div className="flex-1"></div>
    <div className="w-[640px] h-full bg-[url('@/assets/loadBg.png')] flex items-center justify-center">
      <div>
        <img src="@/assets/loading.gif" alt="" />
      </div>
      {
        account?.address ? <div>{ account?.address}</div> : 
        <div onClick={() => disconnect?.()}>connect</div>
      }
    </div>
    <div className="flex-1"></div>
    
  </div>
}

export default AntDesignWeb3