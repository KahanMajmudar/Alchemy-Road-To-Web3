//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

// Example Contract Address on Goerli: 0xDBa03676a2fBb6711CB652beF5B7416A53c1421D

contract BuyMeCoffee {
    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/
    error InsufficientValue();

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    event OwnerUpdated(address indexed user, address indexed newOwner);

    /*//////////////////////////////////////////////////////////////
                            STORAGE
    //////////////////////////////////////////////////////////////*/

    modifier onlyOwner() {
        require(msg.sender == owner, "UNAUTHORIZED");

        _;
    }

    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    address payable owner;

    Memo[] public memos;

    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor() {
        owner = payable(msg.sender);
    }

    /*//////////////////////////////////////////////////////////////
                              LOGIC
    //////////////////////////////////////////////////////////////*/

    function buyCoffee(string memory _name, string memory _message)
        external
        payable
    {
        if (msg.value <= 0) revert InsufficientValue();

        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    function withdrawTips() external {
        owner.transfer(address(this).balance);
    }

    function setOwner(address newOwner) external onlyOwner {
        owner = payable(newOwner);

        emit OwnerUpdated(msg.sender, newOwner);
    }

    function getMemos() external view returns (Memo[] memory) {
        return memos;
    }
}
