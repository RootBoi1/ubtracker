from flask import Flask, render_template, send_from_directory, jsonify, request
import os
import glob
import json
from datetime import date
import pandas as pd

# set the project root directory as the static folder
app = Flask(__name__, template_folder='.')

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)

@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path)

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/getFreeSeats', methods=['GET'])
def get_data():
    period = request.args.get('date')
    dataDict = dict()
    list_of_files = glob.glob('./data/*.csv')
    latest_file = max(list_of_files, key=os.path.getctime)
    df = pd.read_csv(latest_file, delimiter=";")

    if period == "today":
        # column name time
        dataDict["labels"] = [f"{json.loads(i)[3]}:{json.loads(i)[4]}" for i in df.DATE.to_list()]
        # column name count
        dataDict["values"] = df.COUNT.to_list()

    if period == "last_week":
        # column name time
        dataDict["labels"] = [":".join(time[1:-1].replace(" ", "").split(",")[3:-1]) for time in df.DATE.to_list()]
        # column name count
        dataDict["values"] = df.COUNT.to_list()
    return jsonify(dataDict)


if __name__ == "__main__":
    #get_data()
    app.run(debug=True, host="0.0.0.0")
