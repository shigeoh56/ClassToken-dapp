import React, { useState } from 'react'
import {
  Button,
  Input,
  NumberInput,
  NumberInputField,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { parseEther } from '@ethersproject/units'
import { ERC20ABI as abi } from '../abi/ERC20ABI'

interface Props {
  addressContract: string
}

export default function TransferER20(props: Props) {
  const addressContract = props.addressContract
  const [amount, setAmount] = useState<string>('100')
  const [toAddress, setToAddress] = useState<string>('')

  const { account, active, library } = useWeb3React<Web3Provider>()

  async function transfer(event: React.FormEvent) {
    event.preventDefault()
    if (!(active && account && library)) return

    // new contract instance with **signer**
    const erc20 = new Contract(addressContract, abi, library.getSigner())

    erc20
      .transfer(toAddress, parseEther(amount))
      .catch((e: Error) => console.log(e))
  }

  const handleChange = (value: string) => setAmount(value)

  return (
    <form onSubmit={transfer}>
      <FormControl>
        <FormLabel htmlFor="amount">Amount: </FormLabel>
        <NumberInput
          defaultValue={amount}
          min={10}
          max={1000}
          onChange={handleChange}
        >
          <NumberInputField />
        </NumberInput>
        <FormLabel htmlFor="toaddress">To address: </FormLabel>
        <Input
          id="toaddress"
          type="text"
          required
          onChange={(e) => setToAddress(e.target.value)}
          my={3}
        />
        <Button type="submit" isDisabled={!account}>
          Transfer
        </Button>
      </FormControl>
    </form>
  )
}
