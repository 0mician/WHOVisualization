#!/bin/bash

# package required for the project
echo 'provisioning.. '
sudo apt-get update
# packages available through apt-get are quite old
curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
sudo apt-get install -y nodejs mongodb
echo '.. done!'

# database creation
DB_NAME=whoviz
CSV_WHO=/vagrant/data/WHO.csv

echo 'Creation of mongoDB $DB_NAME .. '
if [ ! -e /data/db/$DB_NAME.ns ]; then
    `mongoimport --db $DB_NAME --collection who --type csv --headerline --file $CSV_WHO`
fi
echo '.. done!'
