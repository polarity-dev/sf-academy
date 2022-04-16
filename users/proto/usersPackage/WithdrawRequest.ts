// Original file: proto/users.proto


export interface WithdrawRequest {
  'userId'?: (string);
  'symbol'?: (string);
  'value'?: (number | string);
}

export interface WithdrawRequest__Output {
  'userId'?: (string);
  'symbol'?: (string);
  'value'?: (number);
}
