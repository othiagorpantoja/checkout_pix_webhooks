import { Injectable } from '@nestjs/common'

@Injectable()
export class ConfigService {
  get(key: string): string | undefined {
    return process.env[key]
  }

  getNumber(key: string, def?: number): number | undefined {
    const v = process.env[key]
    return v !== undefined ? Number(v) : def
  }
}
