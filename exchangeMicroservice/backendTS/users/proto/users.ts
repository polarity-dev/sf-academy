import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { UsersClient as _users_UsersClient, UsersDefinition as _users_UsersDefinition } from './users/Users';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  users: {
    BalanceReply: MessageTypeDefinition
    BuyRequest: MessageTypeDefinition
    Empty: MessageTypeDefinition
    LListTransactions: MessageTypeDefinition
    ListTransactionsReply: MessageTypeDefinition
    ListTransactionsRequest: MessageTypeDefinition
    LoginRequest: MessageTypeDefinition
    OperationReply: MessageTypeDefinition
    OperationRequest: MessageTypeDefinition
    SignUpRequest: MessageTypeDefinition
    UserInfoReply: MessageTypeDefinition
    UserInfoRequest: MessageTypeDefinition
    Users: SubtypeConstructor<typeof grpc.Client, _users_UsersClient> & { service: _users_UsersDefinition }
  }
}

