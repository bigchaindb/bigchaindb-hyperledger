#!/usr/bin/env bash

sudo rm -rf ~/HLF && mkdir -p ~/HLF

# create bdb-network if not exist
if ! docker network ls | grep bdb-network; then
    docker network create bdb-network
fi
