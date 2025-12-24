class RequestQueue {
    private queue: Array<() => Promise<void>> = [];
    private isProcessing = false;
    private minInterval = 400; // ms between requests (~2.5 req/sec safely under 3/sec)

    async enqueue<T>(fn: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await fn();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
            this.processQueue();
        });
    }

    private async processQueue() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        while (this.queue.length > 0) {
            const task = this.queue.shift();
            if (task) {
                await task();
                // Wait for the minimum interval before processing the next request
                await new Promise((resolve) => setTimeout(resolve, this.minInterval));
            }
        }

        this.isProcessing = false;
    }
}

// Export a singleton instance
export const requestQueue = new RequestQueue();
