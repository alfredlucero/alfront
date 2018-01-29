// Decentralized Applications built off of Blockchain technology notes:
// - source: https://udemy.com/ethereum-dapp/learn/v4/
// - peer-to-peer architecture model (no centralized server) vs. worldwideweb
// i.e. napster and bittorrent, bitcoin digital currency
// - Bitcoin: coin has identity and owner who can spend the coin, saved as bits on filesystem of those
// on the network, community controls it, network is public, open source
// -> owner uses private key to spend bitcoins and sign transactions
// -> public ledger: all bitcoin exchanges visible to everyone on network
// -> transfer/spending of coins require very little fee
// -> transactions validated by miners who get rewarded
// -> Satoshi Nakamoto, peer-to-peer electronic cash system, first blockchain application

// - blockchain 101: decentralized system for exchange of value
// -> shared distributed ledger, transaction immutability achieved by way of blocks and chaining
// -> leverages consensus mechanism for validating transactions, uses cryptography 
// -> centralized: all nodes connected to central node, single point of failure, scaling, inefficiency
// -> decentralized: p2p network, all nodes equal
// -> distributed ledger: peers hold copies of ledger and nodes in network and can independently validate
// reconciliation intermediaries process
// -> data added to ledger cannot be updated or deleted, transaction data grouped into blocks, index and 
// timestamp and hash value for the block; previousHash value points to previous block (backwards reference chain)
// -> distributed ledger = distributed database; consensus = protocol by which peers agree on state of ledger
// to ensure all peers in network has exactly the same copy of ledger, guarantees chronological record of 
// transactions -- validated through ways such as: proof of work, proof of stake, tendermint
// -> participants have a public/private key pair (cryptography)
// -> transaction signed by owner of asset with private key, anyone can validate the transaction with
// owner's public key

// - ethereum 101:
// -> permissionless public blockchain network like bitcoin, distributed data storage and computing on the nodes
// -> bitcoin doesn't support scripting/code execution on the node
// -> Vitalik and Gavin Wood co-founded Ethereum, frontier version in 2015, 2016 Homestead, future Metropolis and
// Serenity
// -> value token: ETC; block time: 14 seconds (vs. 10 minutes for BTC); block size: depends ~2KB(vs. 1MB for bitcoin);
// scripting: smart contracts (vs. limited in bitcoin and no loops)
// -> smart contracts: computer code written in multiple languages such as Solidity, lives on network and enforces rules,
// performs negotiated actions
// i.e. Buyer sends ethers, Solidity holds ethers in escrow, widget shipped by seller, widget received by buyer,
// funds are then released to seller
// -> network interactions: wallets for managing ethers and smart contracts; 
// decentralized apps (DAPP): interact with contracts on network and execution is not free
// -> can become a miner with wallet or trade other currencies, ether faucets

// Introduction to Decentralized Apps
// - web apps on browser connects to mid tier -> data tier (centralized resources owned by organization)
// - decentralized apps -> frontend connects directly to ethereum network, backend implemented as smart contract
// and deployed on ethereum blockchain, data resides in contract instance, all transactions visible to everyone on network
// -> composed of decentralized resources on public domain
// -> user interactions invoke contracts, user pays gas/transaction fee and the miner collects that for
// the fees for validation transactions and recording them in ledger
// -> ethereum wallet to manage funds and invoke contracts
// -> example for DAPP bidding, contract state changes when functions invoked, gives off events consumed
// by frontend like for buyer (calls bid() function that gives off event BidReceived to seller) and seller 
// (calls withdrawFunds() when satisfied with bid) -> then ships goods to buyer
// -> frontend commonly implemented as SPA but can be in any language, smart contracts with Solidity, Serpent, Lisplike Language
// and web3 libraries connects the Solidity and frontend
// -> frontend connects directly to ethereum network, invokes contract functions, user pays small fee
// to reward miners, data stored in contracts on Ethereum network, data managed in contracts and state changes,
// contract generates events, transactions recorded on chain

// Ethers (ETH), Gas, EVM
// - Ethereum: value token, different denominations like lowest = 1 wei
// - presale 2014: 60 million, 12 million created to fund development
// - 5 ethers created as reward for every block; roughly ~14 seconds
// - sometimes 2-3 ethers for non-winning miners (uncle rewards)
// - contract invocation: users pay by ethers that is incentive for the miners
// - nodes have Ethereum virtual machine, software that executes Ethereum bytecode,
// follows EVM specs (protocol), runs as a process on a computer/server, implemented in multiple languages
// - Gas: user invoking the transaction pays for the execution, unit in which EVM resource usage is measured
// -> transaction leads to execution of contracts, fee paid by originator based on type/number of instructions
// and the amount of storage used on the contract (see opcodes and related gas calculations)
// -> fee calculated by gasUsed (instructions executed), gasPrice = user specified in transaction, miner decides minimal acceptable price
// transaction fee = gasUsed * gasPrice; start gas (units) is max units of gas originator willing to spend vs.
// gas price (ethers) is the per unit gas price that originator willing to pay
// escrow = startGas * gasPrice, refunded some if startGas less than gasUsed, out of gas exception leads to no changes made
// -> each op-code in EVM has fixed gas usage, gas = unit for measuring resource usage on EVM (abstract machine that executes contract code)
// transaction can specify startGas and gasPrice but contract execution may throw out of gas exception and all changes rolled back

// Ethereum Networks
// - live network: public one used for real commerce and contracts with real value
// -> with Network ID = 1
// - Test-Net: permissionless public networks, ethers used do not have real value, for testing
// -> Network ID = 3 Ropsten (current), KOVAN, RINKEBY
// - private network: may want to use the ethereum blockchain for smart contracts that is not public
// -> Network ID = Assigned; for data privacy, as a distributed database
// -> form a consortium (industry verticals), permissioned, internal transactions and contracts like r3.
// - can configure wallet to interact with any of these networks, initially connect Dapp to Test-Net 
// for testing and developing and then point it to live network 
// - developer would use block explorer to see transactions in motion or private/Test-Net network
// -> blockchain explorers implemented as webapps that show information on transactions, blocks, accounts
// like etherscan (etherscan.io, testnet.etherscan.io), ether.camp, etherchain.org
// -> for private network you can use opensource etherparty
// - live network: real transactions here and ether exchanges/contracts; test-net: developers using free testing ethers 
// to test out contracts like Ropsten; private network: multiple entities share a private chain or private network
// -> wallets and dapps can connect to any network
// -> devs can get transaction/block info using explorer apps

// Consensus Models
// - process by which blocks get created
// -> some nodes validate transactions, others reach consensus on whether or not to includes blocks in the chain to secure
// the network; bitcoin/ethereum uses proof of work but ethereum may move to proof of stake
// -> incentive driven model, fixed reward in tokens, transaction fee to validate for miners
// - proof of work: computationally (CPU, memory, bandwidth) intensive
// -> miner has to group the transactions into a block, validate them, generate proof of work by solving a puzzle
// through brute-force solution that is passed into a block as proof of work
// -> first miner to get proof of work for block publishes it to network (competition),
// all nodes validate the block and difficulty of proof of work may change depending on block to keep a uniform rate
// -> hashing functions (different data leads to different hashvalue - one-way in which cannot regenerate data from hash value)
// and it is telling you to guess value of X such that there are N leading 0s in hash
// -> hash functions generate fix length hash string for input data
// X referred to as nonce and N decides the puzzle difficulty
// -> protocol: GHOST, algorithm: ETHash (memory intensive and needs lots of electricity); difficulty: network adjusted such that block created ~12 seconds
// -> incentive: 5 Ether, gas fee for transactions, uncles reward 4.375 ETH Max: 2 (for non-winning miners due to network lag)
// -> proof of work is environmentally un-friendly
// - proof of stake (Ethereum will move to this in the future)
// -> node to validate selected by the network and no competition
// -> stake: refers to wealth that users holds on the network
// -> node that valides referred to as validator not a miner
// -> network selects a validator (higher change depending on stake of validator)
// -> validates the block and adds to blockchains
// -> protocol: CASPER, why switch? reduce energy consumption, lower incentive needed for motivation, stake in network will promote good behavior
// -> punishment as part of protocol will act as deterrent
// - proof of work: nodes compete, first to solve puzzle, environmentally unfriendly
// - proof of stake: node selected by network, selection => staked, low energy consumption (only selected node takes care of computation)

// Ethereum Wallet
// - decentralized application to hold your ether such as Ethereum Wallet, Etherwall, MyEtherWallet, ethereum-wallet
// - reset testnet wallet by deleting testnet folder
// - needs time for wallet to synchronize depending on CPU machine, network bandwidth, number of peers your wallet could connect to
// -> ropsten around a few hours to a day, rinkeby faster but ethers on ropsten cannot be used on rinkeby
// - wallet = desktop app that uses ethereum node/client, knows how to talk to ethereum network
// - uses geth to connect to peers to download blocks, can connect to different networks with same wallet
// - check logs if you face any issues
// - can start mining by going to Develop tab and then start mining with wallet
// -> depends on CPU/memory, number of peers your wallet is connecting/number of miners, internet bandwidth
// -> can use faucets to get free ethers for testing, most ropsten ether faucets are unreliable, can use community faucet in http://thedapps.com (check secret from lecture 17)
// - send ethereum to another address, need to select a fee to pay for transaction (whether cheaper or faster will affect fee)
// -> needs to type password, takes some time to transfer
// - types of wallet accounts
// -> account: has an address, private key protected by password aka externally owned account
// -> contract account: has an address but no private key, hold/run code, associated with accounts, lists incoming transactions (watch only)
// and not free to use because it runs code and needs gas
// - contract single owner: one accounts creates and owns; multisig: one account creates
// -> can't display incoming transactions
// - contract multiple owners (M-of-N type wallets), where N = number of owners, M = required to confirm transaction
// -> like for partnership, one creates contract and all involved contribute ethers and must approve transaction with daily limits on how much can be moved
// and those over daily limit requires confirmation of a certain number of owners, owners must import wallet contracts
// - account types summary:
// -> simple wallet accounts: private key protected by password, incoming transactions not shown
// -> single owner contract account: single account creates/owns, can watch incoming transactions
// -> multisignature contract account: M of N type, single creator and multiple owners
// and has daily spend limit and number of signature required
// - deploying contracts from wallet and custom
// -> watch contracts and custom token (contact)
// - custom contracts provide backend logic for DAPP, deployed to network using wallet and shows up in wallet
// -> may be deployed to network using tools and scripts, may be added wallet
// -> dapp needs interface definition/JSON and contract instance address (can delete contracts but restore it with both of these fields)
// -> can execute the contract functions and watch contract events i.e. a calculator
// - custom contracts may be deployed using Solidity code
// -> invoke functions, watch for events, custom names, delete from wallet (no longer on watch list)
// - watch contracts: just need address and interface definition(JSON) to observe a contract
// - DAPP infrastructure: dapp/wallet co-located with node instance, deploying node locally is expensive
// - Meta Mask: Chrome plugin turns browser into DAPP container and connects to node hosted at MetaMask
// -> local ethereum node not needed, can test against local node or simulator (https://metamask.io)
// -> manage accounts in a browser vault, export/import accounts (need JSON file of keys)
// -> can send funds, exposes web3 object to browser app so you can write SPA without requiring local node available
// -> supports multiple endpoints, does not support contract deployment like a wallet, does not support mining
// - online wallet such as https://wallet.ethereum.org with accounts managed in MetaMask
// -> uses external hosted node rather than local geth node (and unavailable until fully synced)
// -> available right away and keystore managed by MetaMask (vs. keystore managed by app)
// -> supports many networks including private (vs. number of network limited)
// -> no mining option (need a local node for that)
// - developing contracts using Remix (https://ethereum.github.io/browser-solidity)
// -> code smart contracts in a browser, test the contracts in simulator, deploy the contracts to live network
// -> does not have account management; for coding, testing, deploying, execution in online Solidity tool
// -> can use JavaScript VM to test out the contracts for logic or install local geth to test on browser
// - options: JavaScript VM, Ethereum Node, Meta Mask

// Ethereum Networks and Clients
// - client/node connects to other nodes to receive block data, validate, written to local database,
// sends blocks to requesting nodes, dapps lead to transactions and deploying/executing contracts, and mining on client/node
// - yellow paper = specs, client implementation in c++ - eth, python - pyethapp, golang - geth
// -> third party ethereumj (java), ethereumjs-vm (js), ethereumh, ruby-ethereum, node-blockchain-server
// - data received by client managed by local database levelDB (fast key-value storage, put/get/delete), devp2p (port: 30303)
// -> IPC-RPC default, JSON-RPC (http://localhost:8545)
// -> can attach JS API Console to client/node through web3 api to invoke contracts, manage accounts
// - client or node connects to peers using protocol devp2p
// -> receives data from peers -> validates -> writes to local DB (LevelDB)
// -> sends data to peers, receives transactions and propagate to network
// -> execute smart contract functions
// -> dapp and explorer apps or websites need a node
// -> console can be attached to node for invoking web3 API
// - GoLang Ethereum Client
// -> geth [options] command [command options] [args...], ensure it is in PATH
// -> can set up configuration (identity, datadir - set chain data directory, keystore - keyfile directory, networkid, testnet, fast - faster syncing, dev), logging/debugging
// -> geth --identity "MyTestNode" --datadir "./data" --testnet --fast; to start up testnet or --networkid=3, logging level 0-6
