export class MemoryTargetsStorage {
    constructor() {
        this.data = [];
    }
    async load() {
        return this.data;
    }
    async save(targets) {
        this.data = targets;
    }
}
//# sourceMappingURL=memory-storage.js.map