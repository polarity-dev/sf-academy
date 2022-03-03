// Original file: proto/exchange.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ExchangeReply as _exchange_ExchangeReply, ExchangeReply__Output as _exchange_ExchangeReply__Output } from './ExchangeReply';
import type { ExchangeRequest as _exchange_ExchangeRequest, ExchangeRequest__Output as _exchange_ExchangeRequest__Output } from './ExchangeRequest';

export interface ExchangeClient extends grpc.Client {
  Exchange(argument: _exchange_ExchangeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exchange_ExchangeReply__Output>): grpc.ClientUnaryCall;
  Exchange(argument: _exchange_ExchangeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exchange_ExchangeReply__Output>): grpc.ClientUnaryCall;
  Exchange(argument: _exchange_ExchangeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exchange_ExchangeReply__Output>): grpc.ClientUnaryCall;
  Exchange(argument: _exchange_ExchangeRequest, callback: grpc.requestCallback<_exchange_ExchangeReply__Output>): grpc.ClientUnaryCall;
  exchange(argument: _exchange_ExchangeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exchange_ExchangeReply__Output>): grpc.ClientUnaryCall;
  exchange(argument: _exchange_ExchangeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exchange_ExchangeReply__Output>): grpc.ClientUnaryCall;
  exchange(argument: _exchange_ExchangeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exchange_ExchangeReply__Output>): grpc.ClientUnaryCall;
  exchange(argument: _exchange_ExchangeRequest, callback: grpc.requestCallback<_exchange_ExchangeReply__Output>): grpc.ClientUnaryCall;
  
}

export interface ExchangeHandlers extends grpc.UntypedServiceImplementation {
  Exchange: grpc.handleUnaryCall<_exchange_ExchangeRequest__Output, _exchange_ExchangeReply>;
  
}

export interface ExchangeDefinition extends grpc.ServiceDefinition {
  Exchange: MethodDefinition<_exchange_ExchangeRequest, _exchange_ExchangeReply, _exchange_ExchangeRequest__Output, _exchange_ExchangeReply__Output>
}
