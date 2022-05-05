const { expect } = require("chai");
const { ethers } = require("hardhat");

const URI =
	"ipfs://bafkreideyhlkmnf7kfkuat6rtzwrjtwn3p3qdzg4rdnpocu2vaxfsw7mha";

describe("RoadToWeb3", function () {
	it("Should not allow an address to mint more than 5 NFTs", async function () {
		const [owner] = await ethers.getSigners();

		const NFT = await hre.ethers.getContractFactory("RoadToWeb3");
		const nft = await NFT.deploy();
		await nft.deployed();

		for (let i = 0; i < 5; i++) {
			await nft.safeMint(owner.address, URI);
		}

		await expect(nft.safeMint(owner.address, URI)).to.be.revertedWith(
			"Individual Limit Reached"
		);
	});
});
