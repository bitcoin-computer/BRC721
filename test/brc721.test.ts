// import { Computer } from 'bitcoin-computer-lib'
import { NFT } from '../src/nft'
import { BRC721 } from '../src/brc721'
import { Computer } from 'bitcoin-computer-lib'

const opts = {
  seed: 'bright word little amazing coast obvious',

  // uncomment to run locally
  chain: 'LTC',
  url: 'http://127.0.0.1:3000',
  network: 'regtest',
}

describe('BRC721', () => {
  describe('Constructor', () => {
    it('Should create a new BRC721 object', async () => {
      const nft = new NFT('to', 'name', 'symbol')
      expect(nft).toBeDefined()
      expect(nft).toEqual({
        name: 'name',
        symbol: 'symbol',
        _owners: ['to']
      })
    })
  })

  describe('mint', () => {
    it('Should mint tokens', async () => {
      const computer = new Computer(opts)
      const brc721 = new BRC721(computer)
      const publicKey = brc721.computer.db.wallet.getPublicKey().toString()
      const rev = await brc721.mint(publicKey, 'name', 'symbol')
      expect(rev).toBeDefined()
      expect(typeof rev).toBe(NFT)
    })
  })

  describe.only('balanceOf', () => {
    it('Should computer the balance', async () => {
      const computer = new Computer(opts)
      const brc721 = new BRC721(computer)
      const publicKey = brc721.computer.db.wallet.getPublicKey().toString()
      brc721.mint(publicKey, 'name', 'symbol')
      expect(brc721).toBeDefined()
      const balance = await brc721.balanceOf(publicKey)
      expect(balance).toBe(1)
    }, 40000)

  describe('transfer', () => {
    it('Should transfer a token', async () => {
      const computer = new Computer(opts)
      const computer2 = new Computer()
      const brc721 = new BRC721(computer)
      const publicKey = brc721.computer.db.wallet.getPublicKey().toString()
      const token = await brc721.mint(publicKey, 'name', 'symbol')
      await brc721.transferFrom(computer2.db.wallet.getPublicKey().toString(), token._id)
      const res = await brc721.balanceOf(publicKey)
      expect(res).toBe(0)
    }, 80000)
  })
})
