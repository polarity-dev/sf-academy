// Original file: proto/users.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { BuyRequest as _usersPackage_BuyRequest, BuyRequest__Output as _usersPackage_BuyRequest__Output } from '../usersPackage/BuyRequest';
import type { BuyResponse as _usersPackage_BuyResponse, BuyResponse__Output as _usersPackage_BuyResponse__Output } from '../usersPackage/BuyResponse';
import type { DepositRequest as _usersPackage_DepositRequest, DepositRequest__Output as _usersPackage_DepositRequest__Output } from '../usersPackage/DepositRequest';
import type { DepositResponse as _usersPackage_DepositResponse, DepositResponse__Output as _usersPackage_DepositResponse__Output } from '../usersPackage/DepositResponse';
import type { ListTransactionsRequest as _usersPackage_ListTransactionsRequest, ListTransactionsRequest__Output as _usersPackage_ListTransactionsRequest__Output } from '../usersPackage/ListTransactionsRequest';
import type { ListTransactionsResponse as _usersPackage_ListTransactionsResponse, ListTransactionsResponse__Output as _usersPackage_ListTransactionsResponse__Output } from '../usersPackage/ListTransactionsResponse';
import type { LoginRequest as _usersPackage_LoginRequest, LoginRequest__Output as _usersPackage_LoginRequest__Output } from '../usersPackage/LoginRequest';
import type { LoginResponse as _usersPackage_LoginResponse, LoginResponse__Output as _usersPackage_LoginResponse__Output } from '../usersPackage/LoginResponse';
import type { SignupRequest as _usersPackage_SignupRequest, SignupRequest__Output as _usersPackage_SignupRequest__Output } from '../usersPackage/SignupRequest';
import type { SignupResponse as _usersPackage_SignupResponse, SignupResponse__Output as _usersPackage_SignupResponse__Output } from '../usersPackage/SignupResponse';
import type { WithdrawRequest as _usersPackage_WithdrawRequest, WithdrawRequest__Output as _usersPackage_WithdrawRequest__Output } from '../usersPackage/WithdrawRequest';
import type { WithdrawResponse as _usersPackage_WithdrawResponse, WithdrawResponse__Output as _usersPackage_WithdrawResponse__Output } from '../usersPackage/WithdrawResponse';

export interface UsersClient extends grpc.Client {
  Buy(argument: _usersPackage_BuyRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_BuyResponse__Output>): grpc.ClientUnaryCall;
  Buy(argument: _usersPackage_BuyRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_usersPackage_BuyResponse__Output>): grpc.ClientUnaryCall;
  Buy(argument: _usersPackage_BuyRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_BuyResponse__Output>): grpc.ClientUnaryCall;
  Buy(argument: _usersPackage_BuyRequest, callback: grpc.requestCallback<_usersPackage_BuyResponse__Output>): grpc.ClientUnaryCall;
  buy(argument: _usersPackage_BuyRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_BuyResponse__Output>): grpc.ClientUnaryCall;
  buy(argument: _usersPackage_BuyRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_usersPackage_BuyResponse__Output>): grpc.ClientUnaryCall;
  buy(argument: _usersPackage_BuyRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_BuyResponse__Output>): grpc.ClientUnaryCall;
  buy(argument: _usersPackage_BuyRequest, callback: grpc.requestCallback<_usersPackage_BuyResponse__Output>): grpc.ClientUnaryCall;
  
  Deposit(argument: _usersPackage_DepositRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_DepositResponse__Output>): grpc.ClientUnaryCall;
  Deposit(argument: _usersPackage_DepositRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_usersPackage_DepositResponse__Output>): grpc.ClientUnaryCall;
  Deposit(argument: _usersPackage_DepositRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_DepositResponse__Output>): grpc.ClientUnaryCall;
  Deposit(argument: _usersPackage_DepositRequest, callback: grpc.requestCallback<_usersPackage_DepositResponse__Output>): grpc.ClientUnaryCall;
  deposit(argument: _usersPackage_DepositRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_DepositResponse__Output>): grpc.ClientUnaryCall;
  deposit(argument: _usersPackage_DepositRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_usersPackage_DepositResponse__Output>): grpc.ClientUnaryCall;
  deposit(argument: _usersPackage_DepositRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_DepositResponse__Output>): grpc.ClientUnaryCall;
  deposit(argument: _usersPackage_DepositRequest, callback: grpc.requestCallback<_usersPackage_DepositResponse__Output>): grpc.ClientUnaryCall;
  
  ListTransactions(argument: _usersPackage_ListTransactionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_ListTransactionsResponse__Output>): grpc.ClientUnaryCall;
  ListTransactions(argument: _usersPackage_ListTransactionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_usersPackage_ListTransactionsResponse__Output>): grpc.ClientUnaryCall;
  ListTransactions(argument: _usersPackage_ListTransactionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_ListTransactionsResponse__Output>): grpc.ClientUnaryCall;
  ListTransactions(argument: _usersPackage_ListTransactionsRequest, callback: grpc.requestCallback<_usersPackage_ListTransactionsResponse__Output>): grpc.ClientUnaryCall;
  listTransactions(argument: _usersPackage_ListTransactionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_ListTransactionsResponse__Output>): grpc.ClientUnaryCall;
  listTransactions(argument: _usersPackage_ListTransactionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_usersPackage_ListTransactionsResponse__Output>): grpc.ClientUnaryCall;
  listTransactions(argument: _usersPackage_ListTransactionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_ListTransactionsResponse__Output>): grpc.ClientUnaryCall;
  listTransactions(argument: _usersPackage_ListTransactionsRequest, callback: grpc.requestCallback<_usersPackage_ListTransactionsResponse__Output>): grpc.ClientUnaryCall;
  
  Login(argument: _usersPackage_LoginRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_LoginResponse__Output>): grpc.ClientUnaryCall;
  Login(argument: _usersPackage_LoginRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_usersPackage_LoginResponse__Output>): grpc.ClientUnaryCall;
  Login(argument: _usersPackage_LoginRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_LoginResponse__Output>): grpc.ClientUnaryCall;
  Login(argument: _usersPackage_LoginRequest, callback: grpc.requestCallback<_usersPackage_LoginResponse__Output>): grpc.ClientUnaryCall;
  login(argument: _usersPackage_LoginRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_LoginResponse__Output>): grpc.ClientUnaryCall;
  login(argument: _usersPackage_LoginRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_usersPackage_LoginResponse__Output>): grpc.ClientUnaryCall;
  login(argument: _usersPackage_LoginRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_LoginResponse__Output>): grpc.ClientUnaryCall;
  login(argument: _usersPackage_LoginRequest, callback: grpc.requestCallback<_usersPackage_LoginResponse__Output>): grpc.ClientUnaryCall;
  
  Signup(argument: _usersPackage_SignupRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_SignupResponse__Output>): grpc.ClientUnaryCall;
  Signup(argument: _usersPackage_SignupRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_usersPackage_SignupResponse__Output>): grpc.ClientUnaryCall;
  Signup(argument: _usersPackage_SignupRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_SignupResponse__Output>): grpc.ClientUnaryCall;
  Signup(argument: _usersPackage_SignupRequest, callback: grpc.requestCallback<_usersPackage_SignupResponse__Output>): grpc.ClientUnaryCall;
  signup(argument: _usersPackage_SignupRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_SignupResponse__Output>): grpc.ClientUnaryCall;
  signup(argument: _usersPackage_SignupRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_usersPackage_SignupResponse__Output>): grpc.ClientUnaryCall;
  signup(argument: _usersPackage_SignupRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_SignupResponse__Output>): grpc.ClientUnaryCall;
  signup(argument: _usersPackage_SignupRequest, callback: grpc.requestCallback<_usersPackage_SignupResponse__Output>): grpc.ClientUnaryCall;
  
  Withdraw(argument: _usersPackage_WithdrawRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_WithdrawResponse__Output>): grpc.ClientUnaryCall;
  Withdraw(argument: _usersPackage_WithdrawRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_usersPackage_WithdrawResponse__Output>): grpc.ClientUnaryCall;
  Withdraw(argument: _usersPackage_WithdrawRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_WithdrawResponse__Output>): grpc.ClientUnaryCall;
  Withdraw(argument: _usersPackage_WithdrawRequest, callback: grpc.requestCallback<_usersPackage_WithdrawResponse__Output>): grpc.ClientUnaryCall;
  withdraw(argument: _usersPackage_WithdrawRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_WithdrawResponse__Output>): grpc.ClientUnaryCall;
  withdraw(argument: _usersPackage_WithdrawRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_usersPackage_WithdrawResponse__Output>): grpc.ClientUnaryCall;
  withdraw(argument: _usersPackage_WithdrawRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_usersPackage_WithdrawResponse__Output>): grpc.ClientUnaryCall;
  withdraw(argument: _usersPackage_WithdrawRequest, callback: grpc.requestCallback<_usersPackage_WithdrawResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface UsersHandlers extends grpc.UntypedServiceImplementation {
  Buy: grpc.handleUnaryCall<_usersPackage_BuyRequest__Output, _usersPackage_BuyResponse>;
  
  Deposit: grpc.handleUnaryCall<_usersPackage_DepositRequest__Output, _usersPackage_DepositResponse>;
  
  ListTransactions: grpc.handleUnaryCall<_usersPackage_ListTransactionsRequest__Output, _usersPackage_ListTransactionsResponse>;
  
  Login: grpc.handleUnaryCall<_usersPackage_LoginRequest__Output, _usersPackage_LoginResponse>;
  
  Signup: grpc.handleUnaryCall<_usersPackage_SignupRequest__Output, _usersPackage_SignupResponse>;
  
  Withdraw: grpc.handleUnaryCall<_usersPackage_WithdrawRequest__Output, _usersPackage_WithdrawResponse>;
  
}

export interface UsersDefinition extends grpc.ServiceDefinition {
  Buy: MethodDefinition<_usersPackage_BuyRequest, _usersPackage_BuyResponse, _usersPackage_BuyRequest__Output, _usersPackage_BuyResponse__Output>
  Deposit: MethodDefinition<_usersPackage_DepositRequest, _usersPackage_DepositResponse, _usersPackage_DepositRequest__Output, _usersPackage_DepositResponse__Output>
  ListTransactions: MethodDefinition<_usersPackage_ListTransactionsRequest, _usersPackage_ListTransactionsResponse, _usersPackage_ListTransactionsRequest__Output, _usersPackage_ListTransactionsResponse__Output>
  Login: MethodDefinition<_usersPackage_LoginRequest, _usersPackage_LoginResponse, _usersPackage_LoginRequest__Output, _usersPackage_LoginResponse__Output>
  Signup: MethodDefinition<_usersPackage_SignupRequest, _usersPackage_SignupResponse, _usersPackage_SignupRequest__Output, _usersPackage_SignupResponse__Output>
  Withdraw: MethodDefinition<_usersPackage_WithdrawRequest, _usersPackage_WithdrawResponse, _usersPackage_WithdrawRequest__Output, _usersPackage_WithdrawResponse__Output>
}
