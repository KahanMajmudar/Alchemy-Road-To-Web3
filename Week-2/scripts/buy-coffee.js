// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')

const getBalance = async (address) => {
	const balance = await hre.waffle.provider.getBalance(address)
	return hre.ethers.utils.formatEther(balance)
}

const printBalances = async (addresses) => {
	let idx = 0
	for (const address of addresses) {
		console.log(`Address ${idx} balance: ${await getBalance(address)}`)
		idx++
	}
}

const printMemos = async (memos) => {
	for (const memo of memos) {
		const { from: tipperAddress, timestamp, name: tipper, message } = memo
		console.log(
			`At ${timestamp}, ${tipper} (${tipperAddress} said ${message})`
		)
	}
}

async function main() {
	// Hardhat always runs the compile task when running scripts with its command
	// line interface.
	//
	// If this script is run directly using `node` you may want to call compile
	// manually to make sure everything is compiled
	// await hre.run('compile');
	const [owner, tipper1, tipper2, tipper3] = await hre.ethers.getSigners()

	// We get the contract to deploy
	const BuyMeACoffee = await hre.ethers.getContractFactory('BuyMeCoffee')
	const buyMeACoffee = await BuyMeACoffee.deploy()

	await buyMeACoffee.deployed()

	console.log('BuyMeACoffee deployed to:', buyMeACoffee.address)

	console.log('==START==')
	const addresses = [owner.address, tipper1.address, buyMeACoffee.address]
	await printBalances(addresses)

	console.log('==BUYING COFFEE==')
	const tip = { value: hre.ethers.utils.parseEther('1') }
	await buyMeACoffee
		.connect(tipper1)
		.buyCoffee('Tipper 1', 'Awesome Job!', tip)
	await buyMeACoffee
		.connect(tipper2)
		.buyCoffee('Tipper 2', 'Amazing Content', tip)
	await buyMeACoffee
		.connect(tipper3)
		.buyCoffee('Tipper 3', 'Bought a coffee for you', tip)

	await printBalances(addresses)

	console.log('==WITHDRAWING...==')
	await buyMeACoffee.connect(owner).withdrawTips()

	await printBalances(addresses)

	console.log('==MEMOS==')
	const memos = await buyMeACoffee.getMemos()
	await printMemos(memos)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
