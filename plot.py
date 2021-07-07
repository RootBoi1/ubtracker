import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import datetime as d

def plot_data(path="./data.csv"):
    with open(path, 'r') as f:
        data = f.readlines()
    x = []
    y = []
    for line in data:
        time, n = line[:-1].split(",")
        y.append(int(n))
        info = [int(i) for i in time.split(".")]
        x.append(d.datetime(info[2], info[1], info[0], hour=info[3], minute=info[4], second=info[5]))
    fig = plt.figure()
    ax = fig.add_subplot(111)
    ax.plot(x, y)
    plt.xlabel("Time")
    plt.ylabel("Number of free seats")
    plt.gcf().autofmt_xdate()
    myFmt = mdates.DateFormatter('%H:%M')
    ax.xaxis.set_major_formatter(myFmt)
    plt.savefig("dataplot", dpi=800)

if __name__=="__main__":
    plot_data()
