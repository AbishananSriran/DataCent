#!/bin/bash
# See https://docs.aws.amazon.com/lambda/latest/dg/python-package.html#python-package-create-dependencies
mkdir func
pip3 install -t func --platform manylinux2014_x86_64 --only-binary :all: mangum -r requirements.in
cp cloudflare.json func
cp worldcities.csv func
cp kmeans.py func
cp server.py func
cp serverless.py func
cd func
zip ../func.zip -r .
cd ..
rm -rf func
