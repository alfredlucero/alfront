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
