// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    Counters.Counter private allNfts;
    uint256 upgradeCost = 0.5 ether;

    constructor() ERC721("GAMENFT", "GNFT") {}

    /// @dev struct each nft
    struct NFT {
        uint256 tokenId;
        address payable owner;
        uint256 powerValue;
        bool canFight;
    }

    mapping(address => bool) public minters;
    mapping(uint256 => NFT) private nfts; // mapping for nfts
    mapping(address => uint256) public playerpowervalue; // mapping for players

    /// @dev modifier to check if caller has minted an nft
    modifier hasMint() {
        require(minters[msg.sender], "Invalid address");
        _;
    }

    /// @dev modifier to check if the power value of the attacker is greater than the power value of the owner
    modifier canSwallow(uint256 _index) {
        require(nfts[_index].canFight, "NFT isn't in warzone");
        require(
            playerpowervalue[msg.sender] > playerpowervalue[nfts[_index].owner],
            "You have less value point"
        );
        _;
    }

    /// @dev modifier to check if _address is valid
    modifier checkAddress(address _address) {
        require(_address != address(0), "Invalid address");
        _;
    }

    /// @dev modifier to check if caller is owner of the NFT
    modifier isOwner(uint256 _index) {
        require(
            msg.sender == nfts[_index].owner,
            "You are not the NFT's owner"
        );
        _;
    }


    



     // for minting nfts
    function mint(string memory uri) public payable {
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        addNFT(tokenId);// listing the nft 
    }

// adding the nft to the war room 
    function addNFT(uint256 _tokenId ) private{
        uint _powerValue = 0;
        nfts[allNFTs] = NFT(
            _tokenId,
            payable(msg.sender),
            _powerValue
        );
        allNfts.increment();
        minters[msg.sender] = true;
    }

// swallowing an nft and tranfering the nft from the owner to the attacker if the modifier is satisfied
     function swallowNFT(uint _index) external hasmint(msg.sender) canSwallow(msg.sender, _index){
	        require(msg.sender != nfts[_index].owner, "can't swallow your own nft");         
           _transfer(nfts[_index].owner, msg.sender, nfts[_index].tokenId);
           nfts[_index].owner = payable(msg.sender);
	 }

    /// @dev increasing the powervalue of an NFT by its owner and paying 0.5 celo for the transaction
    function upgradeNFT(uint256 _index)
        external
        payable
        exist(_index)
        isOwner(_index)
    {
        require(msg.value == upgradeCost, "You need to pay to upgrade");
        nfts[_index].powerValue++;
        playerpowervalue[msg.sender]++;
        (bool success, ) = payable(owner()).call{value: upgradeCost}("");
        require(success, "Transfer failed");
    }

// returns true if the powervalue of the attacker is greater than the owner 
      function canSwallowNFT(address _address, uint _index) public view returns(bool){
        address ownerAddress = nfts[_index].owner;
        if(playerpowervalue[_address] > playerpowervalue[ownerAddress]){
            return true;
        } else {
            return false;
        }
    }

    /// @dev returns true if the address has minted an nft.
    function hasMinted(address _address)
        public
        view
        checkAddress(_address)
        returns (bool)
    {
        if (minters[_address] == true) {
            return true;
        } else {
            return false;
        }
    }

    /// @dev returning an nft
    function getNft(uint256 _index)
        public
        view
        exist(_index)
        returns (NFT memory)
    {
        return nfts[_index];
    }

    function addToWarRoom(uint256 _index)
        external
        exist(_index)
        isOwner(_index)
    {
        require(!nfts[_index].canFight, "Already in war room");
        nfts[_index].canFight = true;
        _transfer(msg.sender, address(this), nfts[_index].tokenId);
    }

    /// @dev remove the nft from war room
    function removeFromWarRoom(uint256 _index)
        external
        exist(_index)
        isOwner(_index)
    {
        require(nfts[_index].canFight, "Not in war room");
        nfts[_index].canFight = false;
        _transfer(address(this), msg.sender, nfts[_index].tokenId);
    }

    /// @dev getting the length of save the planet nfts in the list
    function getNFTlength() public view returns (uint256) {
        return allNfts.current();
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /// @dev destroy an NFT
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    /// @dev return IPFS url of NFT metadata
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
