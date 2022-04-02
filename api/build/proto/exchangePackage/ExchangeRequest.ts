// Original file: proto/exchange.proto


export interface ExchangeRequest {
  'value'?: (number | string);
  'from'?: (string);
  'to'?: (string);
}

export interface ExchangeRequest__Output {
  'value'?: (number);
  'from'?: (string);
  'to'?: (string);
}
