#!/usr/bin/env bash

PARAMS=$@
if [ ! -z "$1" ]; then # if first argument is not empty
    PARAMS="--env.backend=$1 ${@:2}"
fi


echo "$ webpack-dev-server --https $PARAMS"
#webpack-dev-server --hot --https $PARAMS
webpack-dev-server --hot --https --host 10.0.69.56 --port 8833
