#!/bin/zsh
AES_KEY=$(openssl rand -hex 32)
AES_IV=$(openssl rand -hex 16)
OUTPUT=`echo "hello world" | openssl aes-256-cbc -e -a -K $AES_KEY -iv $AES_IV`
echo $OUTPUT
echo $OUTPUT | openssl aes-256-cbc -d -a -K $AES_KEY -iv $AES_IV