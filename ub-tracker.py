import time
import json
import requests
from datetime import timedelta as td


def save_to_file(date, cap, count, delta, filename="./crapdata.csv"):
    with open(filename, 'a') as f:
        f.write(f"{date};{cap};{count};{delta}\n")
    
def get_free_seats():
    url = "https://checkin.ub.uni-freiburg.de/ajax/external/checkBack.php"
    last = 0
    while True:
        request = requests.post(url)
        data = json.loads(request.text)
        request.close()

        cap = data["cap"]
        count = data["count"]
        delta = data["cap"] - data["count"]

        t = list(time.localtime())
        t[3] = (t[3] + 2) %24  # Server localtime is in UTC -> +2h for MEZ

        if delta != last:
            last = delta 
            save_to_file(t[:6], cap, count, delta, filename=f"./data/{t[2]}-{t[1]}-{t[0]}.csv")
            print(delta)
        if t[3] < 7 and t[3] > 0:
            print(f"Sleeping:\n{t[3]}:{t[4]} - 07:00")
            time_asleep = 25200 - int(td(hours=t[3], minutes=t[4], seconds=t[5]).total_seconds())
            print(f"{int(time_asleep/3600)}h {int((time_asleep%3600)/60)+1}min")
            time.sleep(time_asleep)
 
        time.sleep(1.7)
           


if __name__=="__main__":
    get_free_seats()
