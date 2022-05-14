// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')
const {
	abi,
} = require('../artifacts/contracts/BuyMeCoffee.sol/BuyMeCoffee.json')

const getBalance = async (provider, address) => {
	const balance = await provider.getBalance(address)
	return hre.ethers.utils.formatEther(balance)
}

async function main() {
	// Hardhat always runs the compile task when running scripts with its command
	// line interface.
	//
	// If this script is run directly using `node` you may want to call compile
	// manually to make sure everything is compiled
	// await hre.run('compile');

	const provider = new hre.ethers.providers.AlchemyProvider(
		'maticmum',
		process.env.API_URL.split('/').at(-1)
	)

	const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider)

	const buyMeACoffee = new hre.ethers.Contract(
		'0x4CD68C8a88a523858D3A20fD490507E397ce4b5c',
		abi,
		signer
	)

	console.log(
		`Current owner balance: ${await getBalance(
			provider,
			signer.address
		)} ETH`
	)

	const contractBal = await getBalance(provider, buyMeACoffee.address)

	console.log(`Current contract balance: ${contractBal} ETH`)

	if (contractBal !== '0.0') {
		console.log('withdrawing funds...')
		const withdrawTx = await buyMeACoffee.withdrawTips()
		await withdrawTx.wait()
		console.log(`Receipt: ${withdrawTx}`)
	} else {
		console.log('no funds to withdraw')
	}

	console.log(
		`Current owner balance: ${await getBalance(
			provider,
			signer.address
		)} ETH`
	)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
