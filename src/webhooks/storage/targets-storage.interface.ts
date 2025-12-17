export type Target = { url: string; secret?: string }

export interface TargetsStorage {
  load(): Promise<Target[]>
  save(targets: Target[]): Promise<void>
}
