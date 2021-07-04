import time
import json
import requests


def save_to_file(date, n, filename="./data.csv"):
    with open(filename, 'a') as f:
        f.write(f"{date};{n}\n")
    
def get_free_seats():
    url = "https://checkin.ub.uni-freiburg.de/ajax/external/checkBack.php"
    last = 0
    while True:
        start = time.time()
        request = requests.post(url)
        data = json.loads(request.text)
        free = data["cap"] - data["count"]
        print(free, time.time()-start)
        request.close()
        t = time.localtime()
        date = f"{t[2]}.{t[1]}.{t[0]}.{(t[3]+2)%24}.{t[4]}.{t[5]}"  # Date in the format DD.MM.YYYY.Hour.Minute.Seconds
        if free != last:  # Save to file if number of free seats changes
            last = free
            save_to_file(date, free, "./data2.csv")
        time.sleep(1)
        if (int(t[3])+2)%24 == 23:  # Wait until UB opens again
            time.sleep(8*60*60)


if __name__=="__main__":
    get_free_seats()
