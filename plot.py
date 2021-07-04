import matplotlib.pyplot as plt
import datetime as d

def plot_data(path="./data.csv"):
    with open(path, 'r') as f:
        data = f.readlines)
    x = []
    y = []
    for line in data:
        time, n = line[:-1].split(",")
        y.append(int(n))
        info = [int(i) for i in time.split(".")]
        x.append(d.datetime(info[2], info[1], info[0], hour=info[3], minute=info[4], second=info[5]))
    plt.plot(x, y)
    plt.xlabel("Time")
    plt.ylabel("Number of free seats")
    plt.gcf().autofmt_xdate()
    plt.savefig("dataplot")

if __name__=="__main__":
    plot_data()
