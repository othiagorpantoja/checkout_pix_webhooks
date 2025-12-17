export class InMemoryQueue {
    constructor() {
        this.items = [];
        this.delayed = [];
        this.dlq = [];
        this.handler = null;
        this.running = false;
        this.stopped = false;
        this.maxRetries = Number(process.env.WEBHOOK_MAX_RETRIES || 5);
    }
    async push(message) {
        this.items.push({ body: message, attempts: 0 });
    }
    consume(handler) {
        this.handler = handler;
        if (!this.running)
            this.loop();
    }
    async loop() {
        this.running = true;
        while (!this.stopped) {
            const now = Date.now();
            const ready = this.delayed.filter(d => d.readyAt <= now);
            if (ready.length) {
                this.delayed = this.delayed.filter(d => d.readyAt > now);
                this.items.push(...ready.map(r => ({ body: r.body, attempts: r.attempts })));
            }
            const next = this.items.shift();
            if (!next) {
                await new Promise(r => setTimeout(r, 300));
                continue;
            }
            try {
                if (this.handler)
                    await this.handler(next.body);
            }
            catch (_e) {
                const attempts = next.attempts + 1;
                if (attempts > this.maxRetries) {
                    this.dlq.push(next.body);
                }
                else {
                    const base = 1000;
                    const delay = Math.min(base * 2 ** (attempts - 1), 60000);
                    this.delayed.push({ body: next.body, attempts, readyAt: Date.now() + delay });
                }
            }
        }
    }
    stop() {
        this.stopped = true;
    }
    stats() {
        return {
            queued: this.items.length,
            delayed: this.delayed.length,
            dlq: this.dlq.length
        };
    }
}
//# sourceMappingURL=inmemory-queue.js.map