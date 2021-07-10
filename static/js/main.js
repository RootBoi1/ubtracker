// global chart 
let chart;

// fill labels
let allLabels = [];
let allHours = ["07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"];
let minutes;
allHours.forEach(function (item, index) {
    for (let i = 0; i<60; i++) {
        minutes = i.toString();
        if ((minutes.length) == 1) {
            minutes = "0" + minutes;
        }
        allLabels.push(item+":"+minutes);
    }
});

function refactorData(labels, data) {
    // refactor data to fit standardized labels
    // inp: original labels and original data
    // out: new data
    let newLabels= [], newData = [];
    labels.forEach(function (item, index) {
        if (index == 0) {
            newLabels.push(labels[index]);
            newData.push(data[index]);
        }
        else if (labels[index] != labels[index-1]) {
            newLabels.push(labels[index]);
            newData.push(data[index]);
        }
    });

    newDataFinal = [];
    allLabels.forEach(function (item, index) {
        newDataFinal.push(0);
    });

    newLabels.forEach(function (item, index) {
        time = item;
        if (item.length == 4) {
            time = "0"+time;
        }
        indexInAllLabels = allLabels.indexOf(time, index);
        newDataFinal[indexInAllLabels] = newData[index];
    });
    let currentValue = 0;
    newDataFinal.forEach(function (item, index) {
        if (item != currentValue && item != 0) {
            currentValue = item;
        };
        newDataFinal[index] = currentValue;
    });
    return newDataFinal;
}

// update graph
function update_graph(data) {
    var ctx = document.getElementById('main-chart');
    const dataSet = {
        labels: allLabels,
        datasets: [{
            label: 'Heute',
            data: refactorData(data.labels, data.values),
            fill: true,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.2,
            pointRadius: 0
        }],
        xAxes: [{
            type: 'time',
            ticks: {
                autoSkip: true,
                maxTicksLimit: 4
            }
        }],
    };
    chart = new Chart(ctx, {
        type: 'line',
        data: dataSet,
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                title: {
                    display: true,
                    text: 'Sitzplatzbelegung'
                },
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: 450,
                            yMax: 450,
                            borderColor: 'rgb(255, 99, 132)',
                            borderColor: 'rgb(237, 110, 133)',
                            borderWidth: 1,
                            content: "MAX"
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 25,
                        callback: function(val, index) {
                            // Hide the label of every 2nd dataset
                            return index % 2 === 0 ? this.getLabelForValue(val) : '';
                          },
                    }
                },
                y: {
                    min: 0,
                    max: 500,
                    grid: {
                        display: true,
                        color: 'rgb(238, 238, 238)',
                    }
                },
            }
        },
        hover: {
            mode: 'index',
            intersec: false
        },
    });
}

// add newest data to chart
function addData(label, data) {
    if (label.length == 4) {
        label = "0"+label;
    }
    chart.data.datasets.forEach((dataset) => {
        if (dataset.data[dataset.data.length - 1] != data && label != chart.data.labels[-1]) {
            chart.data.labels.push(label);
            dataset.data.push(data);
        }
        else if (dataset.data[dataset.data.length - 1] != data && label == chart.data.labels[-1]) {
            dataset.data[dataset.data.length - 1] = data;
        }
    });
    chart.update();
}

// update numbers on top of page
function update_numbers(data) {
    $("#free-seats-number").html(data.cap - data.count);
}


// initial ajax call
$.ajax({
    url: 'getFreeSeats',
    data: {
        date: "today"
    },
    success: function(data) {
        update_graph(data);
        refactorData(data.labels, data.values)
        // update_numbers(data);
    },
    complete: function() {
        const d = new Date();
        let dateString = d.toLocaleString();
        $("#date").html(dateString);
        let year = d.getFullYear();
        let month = d.getMonth();
        let day = d.getUTCDay();
    }
});

// ongoing ajax call
(function worker() {
    $.ajax({
        url: 'https://checkin.ub.uni-freiburg.de/ajax/external/checkBack.php',
        success: function(data) {
            const d = new Date();
            let dateString = d.toLocaleString();
            $("#date").html(dateString);
            if (!(typeof chart === 'undefined')) {
                addData(dateString.split(" ")[1].slice(0, -3), data.count);
              }
            update_numbers(data);
        },
        complete: function() {
            /*
            const d = new Date();
            let dateString = d.toLocaleString();
            $("#date").html(dateString);
            let year = d.getFullYear();
            let month = d.getMonth();
            let day = d.getUTCDay();
            */
            setTimeout(worker, 1000);
        }
    });
})();