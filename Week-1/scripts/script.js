// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { expect } = require("chai");
const hre = require("hardhat");

async function main() {
	// Hardhat always runs the compile task when running scripts with its command
	// line interface.
	//
	// If this script is run directly using `node` you may want to call compile
	// manually to make sure everything is compiled
	// await hre.run('compile');

	const [owner] = await ethers.getSigners();

	// We get the contract to deploy
	const NFT = await hre.ethers.getContractFactory("RoadToWeb3");
	const nft = await NFT.deploy();
	await nft.deployed();

	console.log("NFT deployed to:", nft.address);

	const result = await nft.safeMint(
		owner.address,
		"ipfs://bafkreideyhlkmnf7kfkuat6rtzwrjtwn3p3qdzg4rdnpocu2vaxfsw7mha"
	);

	console.log("NFT Minted", result);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
