import time
import json
import requests


def save_to_file(date, n, filename="./data.csv"):
    with open(filename, 'a') as f:
        f.write(f"{date},{n}\n")
    
def get_free_seats():
    url = "https://checkin.ub.uni-freiburg.de/ajax/external/checkBack.php"
    last = 0
    while True:
        start = time.time()
        request = requests.post(url)
        data = json.loads(request.text)
        free = data["cap"] - data["count"]
        request.close()
        t = time.localtime()
        date = f"{t[2]}.{t[1]}.{t[0]}.{(t[3]+2)%24}.{t[4]}.{t[5]}"  # Date in the format DD.MM.YYYY.Hour.Minute.Second
        if (int(t[3])+2)%24==7 and int(t[4]==59):
            if (int(t[3])+2)%24 < 8:  # Wait until UB opens again
                print(f"Sleeping for {((7-(int(t[3])+2)%24))}h {((59-int(t[4])))}min")
                time.sleep(((7-((int(t[3])+2)%24))*3600)+((59-int(t[4]))*60))
        if free != last: 
            last = free
            save_to_file(date, free, "./data.csv")
            print(free)
        time.sleep(1.7)


if __name__=="__main__":
    get_free_seats()
