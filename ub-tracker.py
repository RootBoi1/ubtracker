import gc
import time
from bs4 import BeautifulSoup as bfs
from requests_html import HTMLSession
from requests_html import AsyncHTMLSession as asyncs


def save_to_file(date, n, filename="./data.csv"):
    with open(filename, 'a') as f:
        f.write(f"{date};{n}\n")
        
    
def get_free_seats():
    session = HTMLSession()
    URL = "https://www.ub.uni-freiburg.de/freie-plaetze/#:~:text=Aktuell%20noch%20416%20freie%20Pl%C3%A4tze%20im%20Lesesaal."
    last_iteration = 0
    while True:
        r = session.get(URL, stream=True)
        start = time.time()
        r.html.render(timeout=10)
        soup = bfs(r.html.html, "lxml")
        t = time.localtime()
        date = f"{t[2]}.{t[1]}.{t[0]}.{t[3]+2}.{t[4]}.{t[5]}"
        string = str(soup.find(id="ds")).split(">")
        free = string[3].split(" ")[0]
        try:
            free = int(free)
        except:
            free = 0
        if free != last_iteration:
            last_iteration = free
            save_to_file(date, free)
        print(free, time.time()-start)
        r.close()
        time.sleep(1)
        if int(date[3]+2) == 23:
            time.sleep(8*60*60)


if __name__=="__main__":
    get_free_seats()