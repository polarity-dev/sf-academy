export interface IQueueItem {
  k: number;
  d: string;
}

export interface INode<IQueueItem> {
  p: number; //key
  value: IQueueItem;
}
