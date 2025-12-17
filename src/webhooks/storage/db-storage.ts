import { TargetsStorage, Target } from './targets-storage.interface.js'
import { DataSource, Repository } from 'typeorm'
import { TargetEntity } from './target.entity.js'

export class DbTargetsStorage implements TargetsStorage {
  private ds: DataSource | null = null
  private repo: Repository<TargetEntity> | null = null

  private async ensure() {
    if (this.ds && this.repo) return
    const url = process.env.DB_URL
    if (!url) throw new Error('DB_URL is required for db storage')
    this.ds = new DataSource({ type: 'postgres', url, entities: [TargetEntity], synchronize: true })
    await this.ds.initialize()
    this.repo = this.ds.getRepository(TargetEntity)
  }

  async load(): Promise<Target[]> {
    await this.ensure()
    const all = await this.repo!.find()
    return all.map(a => ({ url: a.url, secret: a.secret ?? undefined }))
  }

  async save(targets: Target[]): Promise<void> {
    await this.ensure()
    const existing = await this.repo!.find()
    const urls = new Set(targets.map(t => t.url))
    const toDelete = existing.filter(e => !urls.has(e.url))
    if (toDelete.length) await this.repo!.remove(toDelete)
    for (const t of targets) {
      const found = existing.find(e => e.url === t.url)
      if (found) {
        found.secret = t.secret ?? null
        await this.repo!.save(found)
      } else {
        const n = this.repo!.create({ url: t.url, secret: t.secret ?? null })
        await this.repo!.save(n)
      }
    }
  }
}
