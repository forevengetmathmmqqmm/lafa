export const transactionEnum = {
  1: {
    label: '原生币交易',
    value: 1
  },
  2: {
    label: '合约交易',
    value: 2
  },
  3: {
    label: '转账',
    value: 3
  },
  4: {
    label: '授权',
    value: 4
  },
}

export type TransType = keyof typeof transactionEnum
export type transactionItem = typeof transactionEnum[TransType]