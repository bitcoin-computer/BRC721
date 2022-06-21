import { NFT } from './nft'

export class BRC721 {
  computer: any
  supply: number
  masterNFT: NFT

  constructor(computer: any, supply: number) {
    this.computer = computer
    this.supply = supply
  }

  async mint(to: string, name: string, symbol: symbol, supply: number) {
    if (!this.masterNFT) {
      this.masterNFT = this.computer.new(NFT, [to, name, symbol, supply])
      return this.masterNFT
    }
    return this.masterNFT.mint(to, name, symbol)
  }

  async balanceOf(publicKey: string): Promise<number> {
    const revs = await this.computer.getRevs({ publicKey, contractName: NFT })
    const objects: NFT[] = await Promise.all(revs.map((rev) => this.computer.sync(rev)))
    objects.flatMap((object) => (object._root === this.masterNFT._root ? [object] : []))
    return objects.length
  }

  async ownerOf(tokenId: string): Promise<string[]> {
    const rev = await this.computer.idToRev(tokenId)
    const obj = await this.computer.sync(rev)
    return obj._owners
  }

  async transferFrom(to: string, tokenId: string) {
    const rev = await this.computer.idToRev(tokenId)
    const obj = await this.computer.sync(rev)
    await obj.send(to)
  }
}
