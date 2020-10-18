import Web3 from 'web3'
import store from '../store/index'
import detectEthereumProvider from '@metamask/detect-provider'
import { CONTRACT_PROVIDER, YFO_HASH, YFODIST_HASH, MAX_NUMBER, pairs } from '../config/constant'
import abi from './yfo.json'
import yfodistABI from './yfodist.json'
import BigNumber from 'bignumber.js'

export const init = async () => {
  const provider = await detectEthereumProvider()

  if (provider) {
    let web3 = new Web3(provider)

    const netVersion = await provider.request({ method: 'net_version' })
    store.commit('update:wallet', {
      name: 'MetaMask',
      netVersion
    })

    const accounts = await provider.request({ method: 'eth_accounts' })
    const address = accounts[0] || ''
    const checksumAddress = address && web3.utils.toChecksumAddress(address)

    const walletInfo = {
      name: 'MetaMask',
      installed: true,
    }

    walletInfo.address = checksumAddress
    store.commit('update:wallet', walletInfo)


    provider.on('accountsChanged', accounts => {
      const address = accounts[0] || ''
      const checksumAddress = address && web3.utils.toChecksumAddress(address)

      store.commit('update:wallet', {
        name: 'MetaMask',
        address: '',
      })
    })

    provider.on('chainChanged', network => {
      store.commit('update:wallet', {
        name: 'MetaMask',
        netVersion: parseInt(network,16).toString(),
        address: '',
      })
    })

  } else {
  }
}

export const connect = async () => {
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } catch(e) {
    console.log(e);
  }
}

export const getContract = ({ provider, abi, contractHash }) => {
  const web3 = new Web3(provider)
  return new web3.eth.Contract(abi, contractHash)
}

export const putApprove = async (pid, callback) => {
  try {
    var web3 = new Web3(window.ethereum);
    const assetContract = new web3.eth.Contract(abi, pid)
    await assetContract.methods
      .approve(YFODIST_HASH, MAX_NUMBER)
      .send({
        from: store.state.wallet.address
      }, callback)
  } catch (e) {
    throw new Error('')
  }
}

export const getAvaliableLP = async (pid) => {
  const contract = getContract({
    provider: CONTRACT_PROVIDER,
    contractHash: pid,
    abi,
  })

  try {
    return await contract.methods.balanceOf(store.state.wallet.address).call()
  } catch (e) {
    return '0'
  }
}

export const getStakedLP = async (pid) => {
  const contract = getContract({
    provider: CONTRACT_PROVIDER,
    contractHash: YFODIST_HASH,
    abi: yfodistABI,
  })

  try {
    return await contract.methods.userInfo(pid, store.state.wallet.address).call()
  } catch (e) {
    return '0'
  }
}

export const getRewardLP = async (hash) => {
  const contract = getContract({
    provider: CONTRACT_PROVIDER,
    contractHash: YFODIST_HASH,
    abi: yfodistABI,
  })

  try {
    return await contract.methods.pendingYfo(hash, store.state.wallet.address).call()
  } catch (e) {
    return '0'
  }
}

export const getAllowance = async (contractHash, spendHash) => {
  const contract = getContract({
    provider: CONTRACT_PROVIDER,
    contractHash,
    abi,
  })

  try {
    return await contract.methods.allowance(store.state.wallet.address, spendHash).call()
  } catch (e) {
    return '0'
  }
}

export const putDeposit = async (pid, amount, callback) => {
  try {
    const x = new BigNumber(10).pow(18)
    const _amount = x.multipliedBy(amount).toString()
    var web3 = new Web3(window.ethereum);
    const assetContract = new web3.eth.Contract(yfodistABI, YFODIST_HASH)
    await assetContract.methods
      .deposit(pid, _amount)
      .send({
        from: store.state.wallet.address
      }, callback)
  } catch (e) {
    return '0'
  }
}

export const putWithdrawAll = async (pid, amount, callback) => {
  try {
    const x = new BigNumber(10).pow(18)
    const _amount = x.multipliedBy(amount).toString()
    var web3 = new Web3(window.ethereum);
    const assetContract = new web3.eth.Contract(yfodistABI, YFODIST_HASH)
    await assetContract.methods
      .withdraw(pid, _amount)
      .send({
        from: store.state.wallet.address
      }, callback)
  } catch (e) {
    return '0'
  }
}

export const getTotalSupply = async () => {
  const contract = getContract({
    provider: CONTRACT_PROVIDER,
    contractHash: YFO_HASH,
    abi,
  })

  try {
    return await contract.methods.totalSupply().call()
  } catch (e) {
    return '0'
  }
}

export const getRewardPerBlock = async () => {
  const contract = getContract({
    provider: CONTRACT_PROVIDER,
    contractHash: YFODIST_HASH,
    abi: yfodistABI,
  })

  try {
    return await contract.methods.rewardPerBlock().call()
  } catch (e) {
    return '0'
  }
}

export const getAvailableBalance = async () => {
  const contract = getContract({
    provider: CONTRACT_PROVIDER,
    contractHash: YFO_HASH,
    abi,
  })

  try {
    return await contract.methods.balanceOf(store.state.wallet.address).call()
  } catch (e) {
    return '0'
  }
}

export const getHomepageBalance = (length, callback) => {
  const { address } = store.state.wallet
  const web3 = new Web3(provider)
  const batch = new web3.BatchRequest()
  console.log(1);
  const balanceContract = new web3.eth.Contract(abi, YFO_HASH)
  const rewardContract = new web3.eth.Contract(yfodistABI, YFODIST_HASH)

  batch.add(balanceContract.methods.balanceOf(address).call.request({ from: address }, _callback))
  pairs.forEach(item => {
    batch.add(rewardContract.methods.balanceOf(address).call.request({ from: address }, _callback))
  })
  console.log(2);

  batch.execute()
  console.log(3);

  const tmp = []
  function _callback(err, result) {

  console.log(4);
    tmp.push(result)

    if(tmp.length == length) {
      callback(tmp)
    }
  }
}