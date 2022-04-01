#!/bin/bash

cd api
rm -rf proto build
cp -r ../proto .
npx proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=proto proto/*.proto
mkdir build
cp -r proto ./build
cp -r openapi ./build
