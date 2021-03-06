import Web3Service from '~/client/services/Web3Service';

const domainParams = [
    {
        name: 'name',
        type: 'string',
    },
    {
        name: 'version',
        type: 'string',
    },
    {
        name: 'verifyingContract',
        type: 'address',
    },
];

const AZTECAccount = [
    {
        name: 'account',
        type: 'address',
    },
    {
        name: 'linkedPublicKey',
        type: 'bytes',
    },
    {
        name: 'AZTECaddress',
        type: 'address',
    },
];

export default ({
    address,
    linkedPublicKey,
    aliasAddress,
}) => {
    const accountRegistryContract = Web3Service.contract('AccountRegistry');

    const domainData = {
        name: 'AccountRegistry',
        version: '2',
        verifyingContract: accountRegistryContract.address,
    };

    const message = {
        account: address,
        AZTECaddress: aliasAddress,
        linkedPublicKey,
    };

    const data = JSON.stringify({
        types: {
            EIP712Domain: domainParams,
            AZTECAccount,
        },
        domain: domainData,
        primaryType: 'AZTECAccount',
        message,
    });

    return data;
};

export const generateTypedData = ({
    address,
    linkedPublicKey,
    aliasAddress,
}) => {
    const accountRegistryContract = Web3Service.contract('AccountRegistry');

    const domainData = {
        name: 'AccountRegistry',
        version: '2',
        verifyingContract: accountRegistryContract.address,
    };

    const message = {
        account: address,
        AZTECaddress: aliasAddress,
        linkedPublicKey,
    };

    return {
        types: {
            EIP712Domain: domainParams,
            AZTECAccount,
        },
        domain: domainData,
        primaryType: 'AZTECAccount',
        message,
    };
};
