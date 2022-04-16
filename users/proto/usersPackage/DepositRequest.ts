// Original file: proto/users.proto


export interface DepositRequest {
  'userId'?: (string);
  'symbol'?: (string);
  'value'?: (number | string);
}

export interface DepositRequest__Output {
  'userId'?: (string);
  'symbol'?: (string);
  'value'?: (number);
}
