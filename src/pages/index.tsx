// src/pages/index.tsx
import type { NextPage } from 'next'
import Head from 'next/head'
import NextLink from 'next/link'
import { VStack, Heading, Box, LinkOverlay, LinkBox } from '@chakra-ui/layout'
import { Text, Button } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import ReadERC20 from '../components/ReadERC20'
import TransferERC20 from '../components/TransferERC20'
import ConnectMetamask from '../components/ConnectMetamask'
import ETHBalance from '../components/ETHBalance'
import ETHBalanceSWR from '../components/ETHBalanceSWR'
declare let window: any

const Home: NextPage = () => {
  const [balance, setBalance] = useState<string | undefined>()
  const [currentAccount, setCurrentAccount] = useState<string | undefined>()
  const [chainId, setChainId] = useState<number | undefined>()
  const [chainName, setChainName] = useState<string | undefined>()

  useEffect(() => {
    if (!currentAccount || !ethers.utils.isAddress(currentAccount)) return
    // client side code
    if (!window.ethereum) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    provider.getBalance(currentAccount).then((result) => {
      setBalance(ethers.utils.formatEther(result))
    })
    provider.getNetwork().then((result) => {
      setChainId(result.chainId)
      setChainName(result.name)
    })
  }, [currentAccount])

  const onClickConnect = () => {
    // client side code
    if (!window.ethereum) {
      console.log('please install Metamask')
      return
    }
    // we can do it using ethers.js
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // Metamask requires requesting permission to connect users accounts
    provider
      .send('eth_requestAccounts', [])
      .then((accounts) => {
        if (accounts.length > 0) setCurrentAccount(accounts[0])
      })
      .catch((e) => console.log(e))
  }

  const onClickDisconnect = () => {
    console.log('onClickDisconnect')
    setBalance(undefined)
    setCurrentAccount(undefined)
  }

  const addressContract = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'

  return (
    <>
      <Head>
        <title>My DAPP</title>
      </Head>

      <Heading as="h3" my={4}>
        Explore Web3
      </Heading>
      <VStack>
        {/* <Box my={4} p={4} w="100%" borderWidth="1px" borderRadius="lg">
          {currentAccount ? (
            <Button type="button" w="100%" onClick={onClickDisconnect}>
              Account:{currentAccount}
            </Button>
          ) : (
            <Button type="button" w="100%" onClick={onClickConnect}>
              Connect MetaMask
            </Button>
          )}
        </Box>
        {currentAccount ? (
          <Box mb={0} p={4} w="100%" borderWidth="1px" borderRadius="lg">
            <Heading my={4} fontSize="x1">
              Account info
            </Heading>
            <Text>ETH Balance of current account: {balance}</Text>
            <Text>
              Chain Info: ChainId {chainId} name {chainName}
            </Text>
          </Box>
        ) : (
          <></>
        )} */}
        <ConnectMetamask />
        <Box mb={0} p={4} w="100%" borderWidth="1px" borderRadius="lg">
          <Heading my={4} fontSize="xl">
            ETH Balance
          </Heading>
          <ETHBalance />
        </Box>
        <Box mb={0} p={4} w="100%" borderWidth="1px" borderRadius="lg">
          <Heading my={4} fontSize="xl">
            ETH Balance <b>using SWR</b>
          </Heading>
          <ETHBalanceSWR />
        </Box>
        <Box my={4} p={4} w="100%" borderWidth="1px" borderRadius="lg">
          <Heading my={4} fontSize="xl">
            Read ClassToken Info
          </Heading>
          <ReadERC20 addressContract={addressContract} />
        </Box>
        <Box mb={0} p={4} w="100%" borderWidth="1px" borderRadius="lg">
          <Heading my={4} fontSize="xl">
            Transfer ClassToken
          </Heading>
          <TransferERC20 addressContract={addressContract} />
        </Box>

        <LinkBox my={4} p={4} w="100%" borderWidth="1px" borderRadius="lg">
          <NextLink
            href="https://github.com/NoahZinsmeister/web3-react/tree/v6"
            passHref
          >
            <LinkOverlay>
              <Heading my={4} fontSize="xl">
                Task 3 with link
              </Heading>
              <Text>Read docs of Web3-React V6</Text>
            </LinkOverlay>
          </NextLink>
        </LinkBox>
      </VStack>
    </>
  )
}

export default Home
