// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract MyNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    uint internal allNFTs = 0; 

    constructor() ERC721("GAMENFT", "GNFT") {}

//  struct each nft
    struct NFT {
        uint tokenId;
        address payable owner;
        uint powerValue; 
    }

    mapping(address => bool) public minters;
    mapping (uint => NFT) internal nfts;// mapping for nfts
    mapping (address => uint) public playerpowervalue;// mapping for players


// modifier to check if an address has minted an nft
     modifier hasmint(address _address) {
        require(minters[_address], "Invalid address");
        _;
    }


// modifier to check if the power value of the attacker is greater than the power value of the owner
     modifier canSwallow(address _address, uint _index) {
       address ownerAddress = nfts[_index].owner;
        require(playerpowervalue[_address] > playerpowervalue[ownerAddress], "You have less value point");
        _;
    }

// Modifier to check for owner 
    modifier onlyOwner(uint _index){
        require(msg.sender == nfts[_index].owner, "Only the owner can access this functionality");
        _;
    }

    



     // for minting nfts
    function mint(string memory uri) public payable {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
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
        allNFTs++;
        minters[msg.sender] = true;
        
    }

// swallowing an nft and tranfering the nft from the owner to the attacker if the modifier is satisfied
     function swallowNFT(uint _index) external hasmint(msg.sender) canSwallow(msg.sender, _index){
	        require(msg.sender != nfts[_index].owner, "can't swallow your own nft");         
           _transfer(nfts[_index].owner, msg.sender, nfts[_index].tokenId);
           nfts[_index].owner = payable(msg.sender);
	 }

// increasing the powervalue of an NFT by its owner and paying 0.5 celo for the transaction
     function upgradeNFT(uint _index) external payable onlyOwner(_index){
         payable(owner()).transfer(msg.value);
         nfts[_index].powerValue++;
         playerpowervalue[msg.sender]++;    
     }

// returns true if the powervalue of the attacker is greater than the owner 
      function canSwallowNFT(address _address, uint _index) public view returns(bool){
        address ownerAddress = nfts[_index].owner;
        if(playerpowervalue[_address] > playerpowervalue[ownerAddress]){
            return true;
        }else{
            return false;
        }
    }
// returns true if the address has minted an nft.
     function hasMinted(address _address) public view returns(bool){
        if(minters[_address] == true){
            return true;
        }else{
            return false;
        }
    }


// returning all nfts
    function getAllNFTS(uint _index) public view returns(NFT memory){
        return nfts[_index]; 
    }

   

// remove the nft from war room
    function remove(uint _index) external onlyOwner(_index){      
            nfts[_index] = nfts[allNFTs - 1];
            delete nfts[allNFTs - 1];
            allNFTs--; 
            _transfer(address(this), msg.sender, nfts[_index].tokenId);
	 }
// getting the length of save the planet nfts in the list
     function getNFTlength() public view returns (uint256) {
        return allNFTs;
    }


   



    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    //    destroy an NFT
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    //    return IPFS url of NFT metadata
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