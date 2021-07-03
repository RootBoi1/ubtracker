import time
import requests
from bs4 import BeautifulSoup as bfs
from requests_html import HTMLSession
from requests_html import AsyncHTMLSession as asyncs

def get_free_seats():
    session = HTMLSession()
    URL = "https://www.ub.uni-freiburg.de/freie-plaetze/#:~:text=Aktuell%20noch%20416%20freie%20Pl%C3%A4tze%20im%20Lesesaal."

    r = session.get(URL, stream=True)
    while True:
        start = time.time()
        r.html.render(retries=1)
        soup = bfs(r.html.html, "lxml")
        string = str(soup.find(id="ds")).split(">")
        free = string[3].split(" ")[0]
        try:
            free = int(free)
        except:
            free = 0
        print(free, time.time()-start)


if __name__=="__main__":
    get_free_seats()
