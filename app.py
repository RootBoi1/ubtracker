from flask import Flask, render_template, send_from_directory, jsonify, request
import glob
import os
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
    # today = date.today()
    dataDict = dict()
    if period == "today":
        list_of_files = glob.glob('./data/*.csv')
        latest_file = max(list_of_files, key=os.path.getctime)
        df = pd.read_csv(latest_file, delimiter=";")

        # column name time
        dataDict["values"] = [",".join(time[1:-1].replace(" ", "").split(",")[3:]) for time in df.DATE.to_list()]

        # column name count
        dataDict["values"] = df.COUNT.to_list()

        return jsonify(dataDict)
    if period == "last_week":
        pass
    f = open("data.csv", "r")
    dataDict = dict()
    for line in f:
        line = line.strip()
        date = line.split(",")[0]
        day = ".".join(date.split(".")[0:2])
        year = date.split(".")[2]
        clock = ".".join(date.split(".")[3:6])
        seats = line.split(",")[1]
        if year not in dataDict:
            dataDict[year] = dict()
        if day not in dataDict[year]:
            dataDict[year][day] = dict()
        dataDict[year][day][clock] = seats
    return jsonify(dataDict)

if __name__ == "__main__":
    #get_data()
    app.run(debug=True)
