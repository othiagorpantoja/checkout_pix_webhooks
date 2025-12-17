import { PixCharge, PixProvider } from './pix-provider.interface.js'

export class MockPixProvider implements PixProvider {
  private charges = new Map<string, PixCharge>()

  async createCharge(amount: number, description?: string): Promise<PixCharge> {
    const id = Math.random().toString(36).slice(2)
    const qrCode = `00020101021226890014BR.GOV.BCB.PIX2550mock+txid+${id}5204000053039865802BR5913Checkout Pix6009Sao Paulo62100506${id}6304ABCD`
    const charge = { id, amount, description, qrCode }
    this.charges.set(id, charge)
    return charge
  }

  async getCharge(id: string): Promise<PixCharge | undefined> {
    return this.charges.get(id)
  }
}
