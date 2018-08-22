#!/usr/bin/env bash

# remove untagged docker images (cleanup space)
if [[ $(docker images -f "dangling=true" -q) ]]; then
	docker rmi $(docker images -f "dangling=true" -q)
fi

./HLF/scripts/startFabric.sh

