import MyERC20TokenABI from '@/abi/MyERC20Token.json';

export const deployedEnum = {
  MyERC20Token: {
    address: "0x48d4961BaB4F0d2C5BC3797EfECE82fbe5b10016",
    blockNumber: "9730969",
    deployedAddress: "0x8058b064B6ad3354A2f463D59024d145C795b3f2",
    gas: "0.001652398509914391",
    name: "MyToken",
    tHash: "0x02ea8dc2fce4f9638bf03a8a6aa9bf973bdacc0dfdbeb292bf687966957c6c4e",
    token: "MTK",
    abi: MyERC20TokenABI.abi,
  }
}
export type deployedEnumKey = keyof typeof deployedEnum
export type ContractItem = typeof deployedEnum[keyof typeof deployedEnum]