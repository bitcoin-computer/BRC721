import { NFT } from './nft'

export class BRC721 {
  computer: any
  masterNFT: NFT

  constructor(computer: any) {
    this.computer = computer
  }

  async mint(to: string, name?: string, symbol?: string) {
    if (!this.masterNFT && name && symbol) {
      this.masterNFT = this.computer.new(NFT, [to, name, symbol])
      return this.masterNFT
    }
    if (this.masterNFT.name !== name || this.masterNFT.symbol !== symbol) {
      throw new Error('Name or symbol mismatch when minting token.')
    }
    return this.masterNFT.mint(to)
  }

  async balanceOf(publicKey: string): Promise<number> {
    const revs = await this.computer.queryRevs({ publicKey, contract: NFT })
    const objects: NFT[] = await Promise.all(revs.map((rev) => this.computer.sync(rev)))
    objects.flatMap((object) => (object._root === this.masterNFT._root ? [object] : []))
    return objects.length
  }

  async ownerOf(tokenId: string): Promise<string[]> {
    const rev = await this.computer.idToRev(tokenId)
    const obj = await this.computer.sync(rev)
    return obj._owners
  }

  async transfer(to: string, tokenId: string) {
    const [rev] = await this.computer.getLatestRevs([tokenId])
    const obj = await this.computer.sync(rev)
    await obj.transfer(to)
  }
}
