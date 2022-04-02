#!/bin/bash

cd api
rm -rf proto build openapi
cp -r ../proto .
cp -r ../openapi .
npx proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=proto proto/*.proto
mkdir build
cp -r proto ./build
cp -r openapi ./build
