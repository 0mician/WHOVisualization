from flask import Flask
from flask import render_template
from flask.ext.pymongo import PyMongo
import json
from bson import json_util
from bson.json_util import dumps

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'whodb'
mongo = PyMongo(app, config_prefix="MONGO")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/test")
def get_who():
    items = list(mongo.db.who.find())
    json_who = []
    for item in items:
        json_who.append(item)
    json_who = json.dumps(json_who, default=json_util.default)
    return json_who

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)
