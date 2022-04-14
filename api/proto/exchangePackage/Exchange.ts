// Original file: proto/exchange.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ExchangeRequest as _exchangePackage_ExchangeRequest, ExchangeRequest__Output as _exchangePackage_ExchangeRequest__Output } from '../exchangePackage/ExchangeRequest';
import type { ExchangeResponse as _exchangePackage_ExchangeResponse, ExchangeResponse__Output as _exchangePackage_ExchangeResponse__Output } from '../exchangePackage/ExchangeResponse';

export interface ExchangeClient extends grpc.Client {
  Exchange(argument: _exchangePackage_ExchangeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exchangePackage_ExchangeResponse__Output>): grpc.ClientUnaryCall;
  Exchange(argument: _exchangePackage_ExchangeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exchangePackage_ExchangeResponse__Output>): grpc.ClientUnaryCall;
  Exchange(argument: _exchangePackage_ExchangeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exchangePackage_ExchangeResponse__Output>): grpc.ClientUnaryCall;
  Exchange(argument: _exchangePackage_ExchangeRequest, callback: grpc.requestCallback<_exchangePackage_ExchangeResponse__Output>): grpc.ClientUnaryCall;
  exchange(argument: _exchangePackage_ExchangeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_exchangePackage_ExchangeResponse__Output>): grpc.ClientUnaryCall;
  exchange(argument: _exchangePackage_ExchangeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_exchangePackage_ExchangeResponse__Output>): grpc.ClientUnaryCall;
  exchange(argument: _exchangePackage_ExchangeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_exchangePackage_ExchangeResponse__Output>): grpc.ClientUnaryCall;
  exchange(argument: _exchangePackage_ExchangeRequest, callback: grpc.requestCallback<_exchangePackage_ExchangeResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface ExchangeHandlers extends grpc.UntypedServiceImplementation {
  Exchange: grpc.handleUnaryCall<_exchangePackage_ExchangeRequest__Output, _exchangePackage_ExchangeResponse>;
  
}

export interface ExchangeDefinition extends grpc.ServiceDefinition {
  Exchange: MethodDefinition<_exchangePackage_ExchangeRequest, _exchangePackage_ExchangeResponse, _exchangePackage_ExchangeRequest__Output, _exchangePackage_ExchangeResponse__Output>
}
