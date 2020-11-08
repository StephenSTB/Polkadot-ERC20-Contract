import { Abi, ContractPromise } from '@polkadot/api-contract';
import contractMetadata from './config/metadata.json';

const abi = new Abi(contractMetadata);
const addr = '5DxpP5DLUjGTPBDxKJLTpfDneCkr9xhnLsjWm3FNiTUfjuTR';


export default function ERC20Contract(api) {
  return new ContractPromise(api, abi, addr);
}