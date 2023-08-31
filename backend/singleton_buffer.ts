interface IQueue {
  K: number,
  D: string
}

class SingletonBuffer {
  private static instance: SingletonBuffer;
  private queues: any[][] = [];
  public readonly length: number = 5;

  private constructor() {
    for (let i: number = 0; i < this.length; i++) {
      this.queues.push([]);
    }
  }

  public static getInstance(): SingletonBuffer {
    if (!SingletonBuffer.instance)
      this.instance = new SingletonBuffer();

    return this.instance;
  }

  public push(P: number, pair: any) {
    this.queues[P - 1].push(pair);
  }

  public pop(P: number) {
    return this.queues[P - 1].shift();
  }

  public getAll(): any {
    let all = Array();
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.queues[i].length; j++) {
        all.push({ K: this.queues[i][j][0], D: this.queues[i][j][1] });
      }
    }
    return all;
  }

  public get(n: number): any[] {
    return this.queues[n];
  }
}

export default SingletonBuffer.getInstance()
