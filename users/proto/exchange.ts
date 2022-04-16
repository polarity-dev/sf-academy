import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { ExchangeClient as _exchangePackage_ExchangeClient, ExchangeDefinition as _exchangePackage_ExchangeDefinition } from './exchangePackage/Exchange';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  exchangePackage: {
    Exchange: SubtypeConstructor<typeof grpc.Client, _exchangePackage_ExchangeClient> & { service: _exchangePackage_ExchangeDefinition }
    ExchangeRequest: MessageTypeDefinition
    ExchangeResponse: MessageTypeDefinition
  }
}

