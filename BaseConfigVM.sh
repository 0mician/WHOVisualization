#!/bin/bash

# package required for the project
echo 'provisioning.. '
sudo apt-get update
sudo apt-get install -y nodejs npm mongodb
echo '.. done!'
