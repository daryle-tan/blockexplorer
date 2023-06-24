import { Alchemy, Network } from "alchemy-sdk"
import { useEffect, useState } from "react"
import logo from "./sherblockLogo.png"
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
  const [index, setIndex] = useState(99)

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
    if (i !== index) {
      setIndex(i)
      getTransactionReceipts(transactionReceipt)
      setTransactionReceipt(transactionReceipt)
    }
    // setTimeout(() => {
    //   console.log("here70", i)
    //   console.log("here71", transactionReceipt)
    //   console.log("here72", blockWithTransaction)
    // }, 1000)
  }

  let transaction
  if (blockWithTransaction && blockWithTransaction.transactions) {
    transaction = blockWithTransaction.transactions.map((blox, i) => {
      return (
        <div key={i}>
          <span className="fields">Transaction Hash: </span>
          <button onClick={() => handleClick(i)} id={i}>
            {blox.hash.slice(0, 8) + "..." + blox.hash.slice(-8)}
          </button>
        </div>
      )
    })
  }

  return (
    <>
      <div className="container-logo">
        <img src={logo} className="icon" alt="Sherblock Holmes Logo" />
      </div>
      <div id="container">
        <div className="App">
          <div className="subApp">
            <span className="blockNumberHeader">-- Current Block --</span>
            <div>
              <span className="fields">Block Number: </span>
              {blockNumber}
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
          <div className="subApp">
            <span className="txDetailsHeader">-- Transaction Details --</span>
            {transactionReceipt ? (
              <>
                <div>
                  <span className="fields">Block Number: </span>
                  {transactionReceipt.blockNumber}
                </div>
                <div>
                  <span className="fields">From: </span>
                  {transactionReceipt.from.slice(0, 8) +
                    "..." +
                    transactionReceipt.from.slice(-8)}
                </div>
                <div>
                  <span className="fields">To: </span>
                  {transactionReceipt.to.slice(0, 8) +
                    "..." +
                    transactionReceipt.to.slice(-8)}
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
        </div>

        <div className="BlockWithTransaction">
          <div className="App2">
            <span className="blockWithTxHeader">
              -- Block with Transactions --
            </span>
            {transaction}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
