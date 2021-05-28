// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Color is ERC721 {
    string[] public colors;
    mapping (string => bool) public _colorExists;
    constructor() ERC721("Color", "COLOR"){
         
    }

    function mint(string memory _color) public{
        // Require unique color
        require(!_colorExists[_color]);

        // Color - add it
        colors.push(_color);
        uint _id = colors.length;
        // Call the mint function
        _mint(msg.sender, _id);
        // Color - track it
        _colorExists[_color] = true;
    }
}