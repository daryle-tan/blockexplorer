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
  const [blockWithTransaction, setBlockWithTransaction] = useState("")
  const [transactionReceipt, setTransactionReceipt] = useState()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    async function getBlockNumbers() {
      setBlockNumber(await alchemy.core.getBlockNumber())
      // console.log("blockNumber", blockNumber)
    }

    async function getBlockWithTransaction(blockNumber) {
      const block = await alchemy.core.getBlockWithTransactions(blockNumber)
      setBlockWithTransaction(block)
    }
    // console.log("blockwTx", blockWithTransaction)
    // console.log("useEffect4", index)
    // console.log("txReceipt5", transactionReceipt)
    getBlockNumbers()
    getBlockWithTransaction(blockNumber)
  }, [])

  async function getTransactionReceipts(transactionReceipt) {
    if (blockWithTransaction && blockWithTransaction.transactions[index]) {
      let tx = await blockWithTransaction.transactions[index].hash
      const txReceipt = await alchemy.core.getTransactionReceipt(tx)
      setTransactionReceipt(txReceipt)
      console.log("tx", txReceipt)
    }
  }

  const handleClick = (i) => {
    // if (i !== index) {
    setIndex(i)
    getTransactionReceipts(transactionReceipt)
    setTransactionReceipt(transactionReceipt)
    // }
    setTimeout(() => {
      console.log("here70", i)
      console.log("here71", transactionReceipt)
      console.log("here72", blockWithTransaction)
    }, 1000)
  }

  let transaction
  if (blockWithTransaction && blockWithTransaction.transactions) {
    transaction = blockWithTransaction.transactions.map((blox, i) => {
      return (
        <div key={i}>
          <span className="field">Transaction Hash: </span>
          <button onClick={() => handleClick(i)} id={i}>
            {blox.hash.slice(0, 8) + "..." + blox.hash.slice(-8)}
          </button>
        </div>
      )
    })
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
              {/* <a onClick={handleClick}> */}
              <span className="fields">Hash: </span>
              {blockWithTransaction.hash.slice(0, 8) +
                "..." +
                blockWithTransaction.hash.slice(-8)}
              {/* </a> */}
            </div>
            <div>
              <span className="fields">Gas Used: </span>
              {parseInt(blockWithTransaction.gasUsed)}
            </div>
            <div>
              <span className="fields">Miner: </span>
              {blockWithTransaction.miner.slice(0, 8) +
                "..." +
                blockWithTransaction.miner.slice(-8)}
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
        <div className="App3">Transaction Details:</div>
        {transactionReceipt ? (
          <>
            <div>
              <span className="fields">Block Number: </span>
              {transactionReceipt.blockNumber}
            </div>
            <div>
              <span className="fields">From: </span>
              {transactionReceipt.from}
            </div>
            <div>
              <span className="fields">To: </span>
              {transactionReceipt.to}
            </div>
            <div>
              <span className="fields">Status: </span>
              {transactionReceipt.status}
            </div>
            <div>
              <span className="fields">Gas Used: </span>
              {parseInt(transactionReceipt.gasUsed)} wei
            </div>
            <div>
              <span className="fields">Gas Price: </span>
              {parseInt(transactionReceipt.effectiveGasPrice)} wei
            </div>
          </>
        ) : null}
      </div>
    </>
  )
}

export default App
