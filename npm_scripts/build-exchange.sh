#!/bin/bash

cd exchange
rm -rf proto build
mkdir -p proto build/proto
cp ../proto/exchange.proto proto/exchange.proto
npx proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=proto proto/*.proto
cp proto/exchange.proto build/proto/exchange.proto
tsc