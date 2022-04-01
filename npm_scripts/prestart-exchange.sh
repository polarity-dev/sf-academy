#!/bin/bash

cd exchange
rm -rf proto/*
cp ../proto/exchange.proto proto/exchange.proto
npx proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=proto proto/*.proto
rm -rf build/*
mkdir -p build/proto
cp proto/exchange.proto build/proto/exchange.proto
