export class NFT {
  coins: number
  _owners: string[]
  name: string
  symbol: string
  supply: number

  constructor(to: string, name: string, symbol: string, supply: number) {
    this._owners = [to]
    this.name = name
    this.symbol = symbol
    this.supply = supply
  }

  send(to: string) {
    this._owners = [to]
  }

  mint(to: string, name: string, symbol) {
    this.supply -= 1
    if (this.supply < 0) throw Error('Cannot mint more NFTs.')
    return new NFT(to, name, symbol, 0)
  }
}
