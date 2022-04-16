// Original file: proto/users.proto


export interface GetUserResponse {
  'username'?: (string);
  'email'?: (string);
  'iban'?: (string);
  'usdBalance'?: (number | string);
  'eurBalance'?: (number | string);
}

export interface GetUserResponse__Output {
  'username'?: (string);
  'email'?: (string);
  'iban'?: (string);
  'usdBalance'?: (number);
  'eurBalance'?: (number);
}
