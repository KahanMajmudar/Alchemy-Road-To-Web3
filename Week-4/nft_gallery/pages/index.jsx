import { useState } from 'react'
import axios from 'axios'

const Home = () => {
    const [walletAddress, setWalletAddress] = useState('')
    const [collectionAddress, setCollectionAddress] = useState('')
    const [NFTs, setNFTs] = useState([])

    const fetchNFTs = async () => {
        let nfts

        console.log('Fetching NFTs...')

        const api_key = process.env.NEXT_PUBLIC_ALCHEMY_ETH_API_KEY
        const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`

        if (!collectionAddress.length) {
            const fetchURL = `${baseURL}?owner=${walletAddress}`
            const result = await axios.get(fetchURL)
            nfts = result.data
        } else {
            console.log('Fetching NFTs for collection owned by address...')
            const fetchURL = `${baseURL}?owner=${walletAddress}&contractAddress%5B%5D=${collectionAddress}`
            const result = await axios.get(fetchURL)
            nfts = result.data
        }

        if (nfts) {
            console.log('NFTs: ', nfts)
            setNFTs(nfts.ownedNfts)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center py-8 gap-y-3">
            <div className="flex flex-col w-full justify-center items-center gap-y-2">
                <input
                    onChange={(e) => {
                        setWalletAddress(e.target.value)
                    }}
                    value={walletAddress}
                    type={'text'}
                    placeholder="Add your wallet address"
                ></input>

                <input
                    onChange={(e) => {
                        setCollectionAddress(e.target.value)
                    }}
                    value={collectionAddress}
                    type={'text'}
                    placeholder="Add the collectionAddress address"
                ></input>

                <label className="text-gray-600 ">
                    <input type={'checkbox'} className="mr-2"></input>Fetch for
                    collectionAddress
                </label>
                <button
                    className={
                        'disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5'
                    }
                    onClick={() => {}}
                >
                    Let's go!{' '}
                </button>
            </div>
        </div>
    )
}

export default Home
