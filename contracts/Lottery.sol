// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Lottery{
    address payable public manager;
    address payable[] public playersA;
    address payable[] public playersB;
    //uint256 public generatedAt; 

    constructor() {
            manager = payable(msg.sender);
            //generatedAt = block.timestamp;
        }

    function enterA() payable public {
        require(msg.value == 0.1 ether);
        //require(block.timestamp < (generatedAt + 900));
        playersA.push(payable(msg.sender));
    }

    function enterB() payable public {
        require(msg.value == 0.1 ether);
        //require(block.timestamp < (generatedAt + 900));
        playersB.push(payable(msg.sender));
    }

    //function randomNumberGenerator() private view returns(uint256) {
    //    return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, playersA)));
    //}

    function WinnerA() public payable restricted{
        //uint128 amount = uint128((ufixed(0.1) + ufixed(0.0975)*ufixed(uint128(playersB.length)/uint128(playersA.length))*ufixed(uint128(1000000000000000000))));
        //uint128 fee = uint128(ufixed(0.275)*ufixed(uint128(playersB.length))*ufixed(uint128(1000000000000000000)));
        uint amount = (uint(1000) + uint(975)*playersB.length/playersA.length)*uint(100000000000000);
        uint fee = uint(25)*playersB.length*uint(100000000000000);
         //uint128 amount = uint128(ufixed(0.1) + ufixed(0.975)*ufixed(uint128(playersB.length)))*uint128(1000000000000000000);
            //uint128 fee = uint128(ufixed(0.275)*ufixed(uint128((playersB.length))))*uint128(1000000000000000000);
            //uint128 weiAmount = uint128(amount)*uint128(1000000000000000000);
            //uint128 weiFee = uint128(fee)*uint128(1000000000000000000);
        //uint index = randomNumberGenerator() % playersA.length;
        for(uint256 index=0;index<playersA.length;index++)
            {
                playersA[index].transfer(amount);
            }
        //playersA[index].transfer(address(this).balance);
        //playersA = new address payable[](0);
        manager.transfer(fee);
    }

    function WinnerB() public payable restricted{
        //uint128 amount = uint128((ufixed(0.1) + ufixed(0.975)*ufixed(uint128(playersA.length)/uint128(playersB.length))*ufixed(uint128(1000000000000000000))));
        //uint128 fee = uint128(ufixed(0.275)*ufixed(uint128(playersA.length))*ufixed(uint128(1000000000000000000)));
        uint amount = (uint(1000) + uint(975)*playersA.length/playersB.length)*uint(100000000000000);
        uint fee = uint(25)*playersA.length*uint(100000000000000);
        //uint128 amount = uint128(ufixed(0.1) + ufixed(0.975)*ufixed(uint128(playersA.length)/uint128(playersB.length)))*uint128(1000000000000000000);
        //uint128 fee = uint128(ufixed(0.275)*ufixed(uint128((playersA.length))));
        //uint128 weiAmount = uint128(amount)*uint128(1000000000000000000);
        //uint128 weiFee = uint128(fee)*uint128(1000000000000000000);
        for(uint256 index=0;index<playersA.length;index++)
            {
                playersA[index].transfer(amount);
            }
        manager.transfer(fee);
    }

    modifier restricted{
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns(address payable[] memory, address payable[] memory){
        return(playersA, playersB);
    }

}
