import { IQueueItem, INode } from "./types";

class SingletonPriorityQueue {
  private static instance: SingletonPriorityQueue;
  private _heap: INode<IQueueItem>[];

  private constructor() {
    this._heap = [];
  }

  public static getInstance(): SingletonPriorityQueue {
    if (!SingletonPriorityQueue.instance)
      this.instance = new SingletonPriorityQueue();

    return this.instance;
  }

  // we append a new node at the bottom right of the tree
  // Then we restore the right order by:
  // - compare the key of new node with its parent
  // - swap if new node's priority is bigger
  // - repeat until parent priority is bigger or new node is on top of the tree
  public push(item: IQueueItem, p: number) {
    this._heap.push({ p, value: item });

    let i = this._heap.length - 1;
    while (i > 0) {
      const parent = this._parent(i);
      if (this._heap[parent].p > this._heap[i].p) break;
      // Heapify
      const tmp = this._heap[i];
      this._heap[i] = this._heap[parent];
      this._heap[parent] = tmp;
      i = parent;
    }
  }

  // We need to remove the root node, if we do it straight away
  // there will be an invalid state with two separate trees
  // so we first swap the root tree with the bottom-right one
  // and then restore the right order by swapping the current
  // node with its smallest child until we have the right order
  public pop() {
    if (this._heap.length == 0) return null;

    this._swap(0, this._heap.length - 1);

    const item: INode<IQueueItem> = this._heap.pop();

    let current = 0;
    while (this._hasLeft(current)) {
      // node children goes from left to right when an insertion happens
      let smallerChild: number = this._left(current);
      if (
        this._hasRight(current) &&
        this._heap[this._right(current)].p > this._heap[this._left(current)].p
      )
        smallerChild = this._right(current);

      if (this._heap[smallerChild].p < this._heap[current].p) break;

      this._swap(current, smallerChild);
      current = smallerChild;
    }

    return item.value;
  }

  public toArray() {
    return this._heap.map((item) => item.value);
  }

  public isEmpty() {
    this._heap.length == 0;
  }

  public peek() {
    this._heap.length == 0 ? null : this._heap[0].value;
  }

  public size() {
    this._heap.length;
  }

  private _parent(index: number) {
    return Math.floor((index - 1) / 2);
  }

  private _left(index: number) {
    return 2 * index + 1;
  }

  private _right(index: number) {
    return 2 * index + 2;
  }

  private _hasLeft(index: number) {
    return this._left(index) < this._heap.length;
  }

  private _hasRight(index: number) {
    return this._right(index) < this._heap.length;
  }

  private _swap(a: number, b: number) {
    const tmp = this._heap[a];
    this._heap[a] = this._heap[b];
    this._heap[b] = tmp;
  }
}

export default SingletonPriorityQueue.getInstance();
