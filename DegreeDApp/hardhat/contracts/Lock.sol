// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Cert {
    address[] public admins;

    constructor(address[] memory _admins) {
        admins.push(msg.sender);
        for(uint i=0; i<_admins.length; i++)
            admins.push(_admins[i]);
    }

    modifier onlyAdmin() {
        bool admin = false;
        for(uint i=0; i<admins.length; i++)
        {
            if(msg.sender == admins[i])
            {
                admin = true;
                break;
            }
        }
        require(admin == true, "Access Denied");
        _;
    }

    struct Certificate {
        string name;
        string degree;
        string grade;
        string date;
    }

    mapping(uint256 => Certificate) public Certificates;
    mapping(uint => uint256) index;
    uint NumCert;

    modifier newID(uint256 _id)
    {
        bool NewID = true;
        for(uint i=0; i<NumCert;i++)
        {
            if(index[i] == _id)
            {
                NewID = false;
                break;
            }
        }
        require(NewID == true, "A certificate has already been issued with this ID.");
        _;
    }

    function issue(
        uint256 _id,
        string memory _name,
        string memory _degree,
        string memory _grade,
        string memory _date
    ) public onlyAdmin newID(_id){
        Certificates[_id] = Certificate(_name, _degree, _grade, _date);
        index[NumCert++] = _id;
    }
}