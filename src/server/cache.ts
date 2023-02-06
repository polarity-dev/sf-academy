//oggetto singleton

class OpCache {
    private static instance: OpCache;
    private queues: any[][];
    public length: number;

    private constructor(qty = 5) {
        this.queues = [];
        for (let i = 0; i < qty; i++) {
            this.queues.push([]);
        }
        this.length = qty;
    }

    public static getInstance(): OpCache {
        if (!OpCache.instance) {
            OpCache.instance = new OpCache();
        }
        return OpCache.instance;
    }

    public push(n: number, item: any) {
        this.queues[n].push(item);
    }

    public pop(n: number): any {
        return this.queues[n].shift();
    }

    public getAll() : any {
        let all = Array();
        for (let i = 0; i < this.length; i++) {
            for (let j = 0; j < this.queues[i].length; j++) {
                all.push({K : this.queues[i][j][0], D : this.queues[i][j][1]});
            }
        }
        return all;
    }

    public get(n: number) : any[] {
        return this.queues[n];
    }
}

export default OpCache.getInstance();