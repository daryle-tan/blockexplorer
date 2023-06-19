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
  const [transactionReceipt, setTransactionReceipt] = useState()
  const [txHash, setTxHash] = useState()

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber())
    }

    async function getBlockWithTransactions(blockNumber) {
      const block = await alchemy.core.getBlockWithTransactions(blockNumber)
      setBlockWithTransaction(block)
    }

    async function getTransactionReceipt(blockWithTransaction) {
      const txReceipt = await getTransactionReceipt(
        blockWithTransaction.transactions.blockHash
      )
      setTransactionReceipt(txReceipt)
    }

    getBlockNumber()
    getBlockWithTransactions(blockNumber)
    // getTransactionReceipt(blockWithTransaction)
  }, [blockNumber])
  // let currentBlock
  // if (currentBlock) {

  // }
  let transaction
  if (blockWithTransaction && blockWithTransaction.transactions) {
    transaction = blockWithTransaction.transactions.map((blox, i) => {
      console.log(blox.blockHash)
      return (
        <div key={i}>
          <span className="fields">Transaction Hash: </span>
          {blox.hash.slice(0, 8) + "..." + blox.hash.slice(-8)}
        </div>
        /* <div>
            <span className="fields">Block: </span>
            {blox.blockNumber}
          </div>
          <div>
            <span className="fields">From: </span>
            {blox.from}
          </div>
          <div>
            <span className="fields">To: </span>
            {blox.to}
          </div>
          <div>
            <span className="fields">Value: </span>
            {parseInt(blox.value)} wei
          </div>
          <div>
            <span className="fields">Transaction Fee: </span>
            {parseInt(blox.maxFeePerGas)} wei
          </div>
          <div>
            <span className="fields">Gas Price: </span>
            {parseInt(blox.gasPrice)} wei */
        /* </div> */
      )
    })
    // let txHash = transaction.
    console.log("here", blockWithTransaction)
  }
  return (
    <>
      <div className="App">
        <div>
          <span className="fields">Block Number: {blockNumber}</span>
        </div>
        {blockWithTransaction ? (
          <>
            <div>
              <span className="fields">Hash: </span>
              {blockWithTransaction.hash.slice(0, 8) +
                "..." +
                blockWithTransaction.hash.slice(-8)}
            </div>
            <div>
              <span className="fields">Gas Used: </span>
              {parseInt(blockWithTransaction.gasUsed)}
            </div>
            <div>
              <span className="fields">Miner: </span>
              {blockWithTransaction.miner}
            </div>
            <div>
              <span className="fields">Nonce: </span>
              {blockWithTransaction.nonce}
            </div>
            <div>
              <span className="fields">Timestamp: </span>
              {blockWithTransaction.timestamp}
            </div>
          </>
        ) : null}
      </div>

      <div className="BlockWithTransaction">
        <div className="App2">
          Block With Transaction:
          {transaction}
        </div>
      </div>

      <div className="oneTransaction">
        <div className="App3">Transaction:</div>
      </div>
    </>
  )
}

export default App
