import { promises as fs } from 'node:fs';
import path from 'node:path';
export class FileTargetsStorage {
    constructor(filePath) {
        this.filePath = filePath || path.resolve(process.cwd(), 'data', 'targets.json');
    }
    async ensureDir() {
        const dir = path.dirname(this.filePath);
        await fs.mkdir(dir, { recursive: true });
    }
    async load() {
        try {
            const buf = await fs.readFile(this.filePath);
            const json = JSON.parse(buf.toString());
            if (Array.isArray(json))
                return json;
            return [];
        }
        catch {
            return [];
        }
    }
    async save(targets) {
        await this.ensureDir();
        await fs.writeFile(this.filePath, JSON.stringify(targets, null, 2));
    }
}
//# sourceMappingURL=file-storage.js.map