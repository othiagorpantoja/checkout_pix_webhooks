export type PixCharge = {
  id: string
  amount: number
  description?: string
  qrCode: string
}

export interface PixProvider {
  createCharge(amount: number, description?: string): Promise<PixCharge>
  getCharge(id: string): Promise<PixCharge | undefined>
}
