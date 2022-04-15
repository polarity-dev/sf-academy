// Original file: proto/users.proto


export interface Transaction {
  'usdDelta'?: (number | string);
  'eurDelta'?: (number | string);
  'timestamp'?: (string);
}

export interface Transaction__Output {
  'usdDelta'?: (number);
  'eurDelta'?: (number);
  'timestamp'?: (string);
}
