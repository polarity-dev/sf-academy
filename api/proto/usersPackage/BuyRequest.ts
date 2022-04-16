// Original file: proto/users.proto


export interface BuyRequest {
  'userId'?: (string);
  'symbol'?: (string);
  'value'?: (number | string);
}

export interface BuyRequest__Output {
  'userId'?: (string);
  'symbol'?: (string);
  'value'?: (number);
}
