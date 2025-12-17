import { TargetsStorage, Target } from './targets-storage.interface.js'
import { promises as fs } from 'node:fs'
import path from 'node:path'

export class FileTargetsStorage implements TargetsStorage {
  private filePath: string
  constructor(filePath?: string) {
    this.filePath = filePath || path.resolve(process.cwd(), 'data', 'targets.json')
  }
  private async ensureDir() {
    const dir = path.dirname(this.filePath)
    await fs.mkdir(dir, { recursive: true })
  }
  async load(): Promise<Target[]> {
    try {
      const buf = await fs.readFile(this.filePath)
      const json = JSON.parse(buf.toString())
      if (Array.isArray(json)) return json
      return []
    } catch {
      return []
    }
  }
  async save(targets: Target[]): Promise<void> {
    await this.ensureDir()
    await fs.writeFile(this.filePath, JSON.stringify(targets, null, 2))
  }
}
