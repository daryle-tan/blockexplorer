import { Alchemy, BigNumber, Network } from "alchemy-sdk"
import { useEffect, useState } from "react"

import "./App.css"

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
}

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings)

function App() {
  const [blockNumber, setBlockNumber] = useState()
  const [blockWithTransaction, setBlockWithTransaction] = useState()

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber())
    }

    async function getBlockWithTransactions(blockNumber) {
      const block = await alchemy.core.getBlockWithTransactions(blockNumber)
      setBlockWithTransaction(block)
    }

    getBlockNumber()
    getBlockWithTransactions(blockNumber)
    // console.log(blockWithTransaction.transactions)
  }, [])
  // console.log(blockWithTransaction.transactions)
  let transaction
  if (blockWithTransaction && blockWithTransaction.transactions) {
    transaction = blockWithTransaction.transactions.map((blox, i) => {
      console.log(blox.blockHash)
      return (
        <div key={i}>
          Block With Transaction:
          <div key={i}>
            Transaction Hash:{" "}
            {blox.blockHash.slice(0, 8) + "..." + blox.blockHash.slice(-8)}
          </div>
          <div>Block: {blox.blockNumber}</div>
          <div>From: {blox.from}</div>
          <div>To: {blox.to}</div>
          <div>Value: {parseInt(blox.value)}</div>
          <div>Transaction Fee: {parseInt(blox.maxFeePerGas)}</div>
          <div>Gas Price: {parseInt(blox.gasPrice)}</div>
        </div>
      )
    })
    console.log(blockWithTransaction)
  }
  return (
    <>
      <div className="App">Block Number: {blockNumber}</div>

      <div className="App">{transaction}</div>
    </>
  )
}

export default App
