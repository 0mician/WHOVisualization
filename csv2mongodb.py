#!/usr/bin/python

import sys
import pandas as pd
from pymongo import MongoClient

client = MongoClient()
db = client.whodb
collection = db.who

df = pd.read_csv(sys.argv[1])

# need to strip all "." from key names (mongodb requirement)
names = []
for i in range(0,len(df.columns)):
    names.append(df.columns[i].replace(".", ""))
df.columns = names

# parsing dataframe and exporting each row to mongodb
for row in df.iterrows():
    post = row[1].to_dict()
    i = collection.insert_one(post).inserted_id




