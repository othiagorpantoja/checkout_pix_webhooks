import { TargetsStorage, Target } from './targets-storage.interface.js'

export class MemoryTargetsStorage implements TargetsStorage {
  private data: Target[] = []
  async load(): Promise<Target[]> {
    return this.data
  }
  async save(targets: Target[]): Promise<void> {
    this.data = targets
  }
}
