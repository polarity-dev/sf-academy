import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { ExchangeClient as _exchange_ExchangeClient, ExchangeDefinition as _exchange_ExchangeDefinition } from './exchange/Exchange';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  exchange: {
    Exchange: SubtypeConstructor<typeof grpc.Client, _exchange_ExchangeClient> & { service: _exchange_ExchangeDefinition }
    ExchangeReply: MessageTypeDefinition
    ExchangeRequest: MessageTypeDefinition
  }
}

