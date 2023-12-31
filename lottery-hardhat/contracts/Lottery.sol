// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract Lottery {
    address public owner;
    address payable[] public players;
    uint256 public lotteryId;
    mapping(uint256 => address) public lotteryHistory;


    constructor() {
        owner = msg.sender;
    }

    function enter() public payable {
        require(msg.value >= .01 ether, "msg.value should be greater than or equal to 0.01 ETH");
        players.push(payable(msg.sender));
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }
    
    function getRandomNumber() public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(owner, block.timestamp)));
    }


    function getRandomNumberV2() public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function getRandomNumberV3() public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp)));
    }

    function pickWinner() public onlyOwner {
        uint256 index = getRandomNumberV2() % players.length;
        lotteryHistory[lotteryId] = players[index];
        lotteryId++;

        (bool success, ) = players[index].call{ value : address(this).balance }("");
        require(success, "Failed to send ETH");

        players = new address payable[](0);
    }

    modifier onlyOwner {
        require(msg.sender == owner, "U r not owner");
        _;
    }
}