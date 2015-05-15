from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import re
from bson import json_util
from bson.json_util import dumps

app = Flask(__name__, static_url_path='')

def replace_nan(encoded):
    regex = re.compile(r'\bNaN\b')
    return regex.sub('null', encoded)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/test")
def get_who():
    c = MongoClient()
    db = c.whodb
    json_who = []
    for result in db.who.find():
        json_who.append(result)
    json_who = replace_nan(json.dumps(json_who, default=json_util.default))
    return json_who

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
