//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract ChainBattles is ERC721 {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct TokenInfo {
        uint256 level;
        uint256 speed;
        uint256 strength;
        uint256 life;
    }

    mapping(uint256 => TokenInfo) tokenIdToInfo;

    constructor() ERC721("Chain Battles", "CBTLS") {}

    function mint() external {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId);

        uint256 randNum = rand();

        tokenIdToInfo[newItemId] = TokenInfo({
            level: randNum,
            speed: randNum,
            strength: randNum,
            life: randNum
        });
    }

    function train(uint256 tokenId) external {
        require(_exists(tokenId));
        require(
            ownerOf(tokenId) == msg.sender,
            "You must own this NFT to train it!"
        );

        TokenInfo storage info = tokenIdToInfo[tokenId];

        info.level++;
        info.speed++;
        info.strength++;
        info.life++;

        tokenIdToInfo[tokenId] = info;
    }

    function generateCharacter(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        (
            string memory level,
            string memory speed,
            string memory strength,
            string memory life
        ) = getNftInfo(tokenId);

        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            "<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>",
            '<rect width="100%" height="100%" fill="black" />',
            '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">',
            "Warrior",
            "</text>",
            '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">',
            "Level: ",
            level,
            "\n",
            "Speed: ",
            speed,
            "\n",
            "Strength: ",
            strength,
            "\n",
            "Life: ",
            life,
            "\n",
            "</text>",
            "</svg>"
        );
        return
            string(
                abi.encodePacked(
                    "data:image/svg+xml;base64,",
                    Base64.encode(svg)
                )
            );
    }

    function getNftInfo(uint256 tokenId)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        TokenInfo memory info = tokenIdToInfo[tokenId];

        uint256 level = info.level;
        uint256 speed = info.speed;
        uint256 strength = info.strength;
        uint256 life = info.life;

        return (
            level.toString(),
            speed.toString(),
            strength.toString(),
            life.toString()
        );
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        bytes memory dataURI = abi.encodePacked(
            "{",
            '"name": "Chain Battles #',
            tokenId.toString(),
            '",',
            '"description": "Battles on chain",',
            '"image": "',
            generateCharacter(tokenId),
            '"',
            "}"
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(dataURI)
                )
            );
    }

    function rand() public view returns (uint256) {
        uint256 seed = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp +
                        block.difficulty +
                        ((
                            uint256(keccak256(abi.encodePacked(block.coinbase)))
                        ) / (block.timestamp)) +
                        block.gaslimit +
                        ((uint256(keccak256(abi.encodePacked(msg.sender)))) /
                            (block.timestamp)) +
                        block.number
                )
            )
        );

        return (seed - ((seed / 10) * 10));
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721)
        returns (string memory)
    {
        return getTokenURI(tokenId);
    }
}
