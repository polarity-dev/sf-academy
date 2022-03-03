// Original file: proto/users.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { BalanceReply as _users_BalanceReply, BalanceReply__Output as _users_BalanceReply__Output } from '../users/BalanceReply';
import type { BuyRequest as _users_BuyRequest, BuyRequest__Output as _users_BuyRequest__Output } from '../users/BuyRequest';
import type { ListTransactionsReply as _users_ListTransactionsReply, ListTransactionsReply__Output as _users_ListTransactionsReply__Output } from '../users/ListTransactionsReply';
import type { ListTransactionsRequest as _users_ListTransactionsRequest, ListTransactionsRequest__Output as _users_ListTransactionsRequest__Output } from '../users/ListTransactionsRequest';
import type { LoginRequest as _users_LoginRequest, LoginRequest__Output as _users_LoginRequest__Output } from '../users/LoginRequest';
import type { OperationReply as _users_OperationReply, OperationReply__Output as _users_OperationReply__Output } from '../users/OperationReply';
import type { OperationRequest as _users_OperationRequest, OperationRequest__Output as _users_OperationRequest__Output } from '../users/OperationRequest';
import type { SignUpRequest as _users_SignUpRequest, SignUpRequest__Output as _users_SignUpRequest__Output } from '../users/SignUpRequest';
import type { UserInfoReply as _users_UserInfoReply, UserInfoReply__Output as _users_UserInfoReply__Output } from '../users/UserInfoReply';
import type { UserInfoRequest as _users_UserInfoRequest, UserInfoRequest__Output as _users_UserInfoRequest__Output } from '../users/UserInfoRequest';

export interface UsersClient extends grpc.Client {
  Buy(argument: _users_BuyRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  Buy(argument: _users_BuyRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  Buy(argument: _users_BuyRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  Buy(argument: _users_BuyRequest, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  buy(argument: _users_BuyRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  buy(argument: _users_BuyRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  buy(argument: _users_BuyRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  buy(argument: _users_BuyRequest, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  
  Deposit(argument: _users_OperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  Deposit(argument: _users_OperationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  Deposit(argument: _users_OperationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  Deposit(argument: _users_OperationRequest, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  deposit(argument: _users_OperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  deposit(argument: _users_OperationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  deposit(argument: _users_OperationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  deposit(argument: _users_OperationRequest, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  
  GetBalance(argument: _users_UserInfoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_users_BalanceReply__Output>): grpc.ClientUnaryCall;
  GetBalance(argument: _users_UserInfoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_users_BalanceReply__Output>): grpc.ClientUnaryCall;
  GetBalance(argument: _users_UserInfoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_users_BalanceReply__Output>): grpc.ClientUnaryCall;
  GetBalance(argument: _users_UserInfoRequest, callback: grpc.requestCallback<_users_BalanceReply__Output>): grpc.ClientUnaryCall;
  getBalance(argument: _users_UserInfoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_users_BalanceReply__Output>): grpc.ClientUnaryCall;
  getBalance(argument: _users_UserInfoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_users_BalanceReply__Output>): grpc.ClientUnaryCall;
  getBalance(argument: _users_UserInfoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_users_BalanceReply__Output>): grpc.ClientUnaryCall;
  getBalance(argument: _users_UserInfoRequest, callback: grpc.requestCallback<_users_BalanceReply__Output>): grpc.ClientUnaryCall;
  
  ListTransactions(argument: _users_ListTransactionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_users_ListTransactionsReply__Output>): grpc.ClientUnaryCall;
  ListTransactions(argument: _users_ListTransactionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_users_ListTransactionsReply__Output>): grpc.ClientUnaryCall;
  ListTransactions(argument: _users_ListTransactionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_users_ListTransactionsReply__Output>): grpc.ClientUnaryCall;
  ListTransactions(argument: _users_ListTransactionsRequest, callback: grpc.requestCallback<_users_ListTransactionsReply__Output>): grpc.ClientUnaryCall;
  listTransactions(argument: _users_ListTransactionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_users_ListTransactionsReply__Output>): grpc.ClientUnaryCall;
  listTransactions(argument: _users_ListTransactionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_users_ListTransactionsReply__Output>): grpc.ClientUnaryCall;
  listTransactions(argument: _users_ListTransactionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_users_ListTransactionsReply__Output>): grpc.ClientUnaryCall;
  listTransactions(argument: _users_ListTransactionsRequest, callback: grpc.requestCallback<_users_ListTransactionsReply__Output>): grpc.ClientUnaryCall;
  
  Login(argument: _users_LoginRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_users_UserInfoReply__Output>): grpc.ClientUnaryCall;
  Login(argument: _users_LoginRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_users_UserInfoReply__Output>): grpc.ClientUnaryCall;
  Login(argument: _users_LoginRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_users_UserInfoReply__Output>): grpc.ClientUnaryCall;
  Login(argument: _users_LoginRequest, callback: grpc.requestCallback<_users_UserInfoReply__Output>): grpc.ClientUnaryCall;
  login(argument: _users_LoginRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_users_UserInfoReply__Output>): grpc.ClientUnaryCall;
  login(argument: _users_LoginRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_users_UserInfoReply__Output>): grpc.ClientUnaryCall;
  login(argument: _users_LoginRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_users_UserInfoReply__Output>): grpc.ClientUnaryCall;
  login(argument: _users_LoginRequest, callback: grpc.requestCallback<_users_UserInfoReply__Output>): grpc.ClientUnaryCall;
  
  Signup(argument: _users_SignUpRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  Signup(argument: _users_SignUpRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  Signup(argument: _users_SignUpRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  Signup(argument: _users_SignUpRequest, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  signup(argument: _users_SignUpRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  signup(argument: _users_SignUpRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  signup(argument: _users_SignUpRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  signup(argument: _users_SignUpRequest, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  
  UserAuth(argument: _users_UserInfoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_users_UserInfoReply__Output>): grpc.ClientUnaryCall;
  UserAuth(argument: _users_UserInfoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_users_UserInfoReply__Output>): grpc.ClientUnaryCall;
  UserAuth(argument: _users_UserInfoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_users_UserInfoReply__Output>): grpc.ClientUnaryCall;
  UserAuth(argument: _users_UserInfoRequest, callback: grpc.requestCallback<_users_UserInfoReply__Output>): grpc.ClientUnaryCall;
  userAuth(argument: _users_UserInfoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_users_UserInfoReply__Output>): grpc.ClientUnaryCall;
  userAuth(argument: _users_UserInfoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_users_UserInfoReply__Output>): grpc.ClientUnaryCall;
  userAuth(argument: _users_UserInfoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_users_UserInfoReply__Output>): grpc.ClientUnaryCall;
  userAuth(argument: _users_UserInfoRequest, callback: grpc.requestCallback<_users_UserInfoReply__Output>): grpc.ClientUnaryCall;
  
  Withdraw(argument: _users_OperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  Withdraw(argument: _users_OperationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  Withdraw(argument: _users_OperationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  Withdraw(argument: _users_OperationRequest, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  withdraw(argument: _users_OperationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  withdraw(argument: _users_OperationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  withdraw(argument: _users_OperationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  withdraw(argument: _users_OperationRequest, callback: grpc.requestCallback<_users_OperationReply__Output>): grpc.ClientUnaryCall;
  
}

export interface UsersHandlers extends grpc.UntypedServiceImplementation {
  Buy: grpc.handleUnaryCall<_users_BuyRequest__Output, _users_OperationReply>;
  
  Deposit: grpc.handleUnaryCall<_users_OperationRequest__Output, _users_OperationReply>;
  
  GetBalance: grpc.handleUnaryCall<_users_UserInfoRequest__Output, _users_BalanceReply>;
  
  ListTransactions: grpc.handleUnaryCall<_users_ListTransactionsRequest__Output, _users_ListTransactionsReply>;
  
  Login: grpc.handleUnaryCall<_users_LoginRequest__Output, _users_UserInfoReply>;
  
  Signup: grpc.handleUnaryCall<_users_SignUpRequest__Output, _users_OperationReply>;
  
  UserAuth: grpc.handleUnaryCall<_users_UserInfoRequest__Output, _users_UserInfoReply>;
  
  Withdraw: grpc.handleUnaryCall<_users_OperationRequest__Output, _users_OperationReply>;
  
}

export interface UsersDefinition extends grpc.ServiceDefinition {
  Buy: MethodDefinition<_users_BuyRequest, _users_OperationReply, _users_BuyRequest__Output, _users_OperationReply__Output>
  Deposit: MethodDefinition<_users_OperationRequest, _users_OperationReply, _users_OperationRequest__Output, _users_OperationReply__Output>
  GetBalance: MethodDefinition<_users_UserInfoRequest, _users_BalanceReply, _users_UserInfoRequest__Output, _users_BalanceReply__Output>
  ListTransactions: MethodDefinition<_users_ListTransactionsRequest, _users_ListTransactionsReply, _users_ListTransactionsRequest__Output, _users_ListTransactionsReply__Output>
  Login: MethodDefinition<_users_LoginRequest, _users_UserInfoReply, _users_LoginRequest__Output, _users_UserInfoReply__Output>
  Signup: MethodDefinition<_users_SignUpRequest, _users_OperationReply, _users_SignUpRequest__Output, _users_OperationReply__Output>
  UserAuth: MethodDefinition<_users_UserInfoRequest, _users_UserInfoReply, _users_UserInfoRequest__Output, _users_UserInfoReply__Output>
  Withdraw: MethodDefinition<_users_OperationRequest, _users_OperationReply, _users_OperationRequest__Output, _users_OperationReply__Output>
}
