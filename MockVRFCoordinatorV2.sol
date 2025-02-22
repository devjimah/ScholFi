// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@chainlink/contracts/src/v0.8/vrf/dev/VRFV2PlusWrapper.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";

contract MockVRFCoordinatorV2 {
    uint256 private nonce = 0;
    mapping(uint256 => address) public s_consumers;
    mapping(uint256 => uint256) public s_randomWords;

    function requestRandomness(
        bytes32 keyHash,
        uint256 subId,
        uint16 requestConfirmations,
        uint32 callbackGasLimit,
        uint32 numWords,
        bool nativePayment
    ) external returns (uint256) {
        uint256 requestId = nonce++;
        s_consumers[requestId] = msg.sender;
        
        // Simulate callback with a random number
        uint256[] memory randomWords = new uint256[](1);
        randomWords[0] = uint256(keccak256(abi.encode(block.timestamp, msg.sender, requestId)));
        s_randomWords[requestId] = randomWords[0];
        
        VRFConsumerBaseV2Plus(msg.sender).rawFulfillRandomWords(requestId, randomWords);
        
        return requestId;
    }

    function calculateRequestPrice(uint32 _callbackGasLimit, bool _nativePayment)
        external
        pure
        returns (uint256)
    {
        return 0;
    }

    function getRandomness(uint256 requestId) external view returns (uint256) {
        return s_randomWords[requestId];
    }
}
