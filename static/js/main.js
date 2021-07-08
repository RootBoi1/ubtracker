let today = {
    labels: [],
    values: [],
    Cap: "450"
};
let currentData = {};
let last_week = {
    labels: {

    }
}
let chart;

function addData(label, data) {
    chart.data.datasets.forEach((dataset) => {
        if (dataset.data[dataset.data.length - 1] != data) {
            chart.data.labels.push(label);
            dataset.data.push(data);
        }
    });
    chart.update();
}


// update graph
function update_graph(data) {
    var ctx = document.getElementById('main-chart');
    const dataSet = {
        labels: data.labels,
        datasets: [{
            label: 'Heute',
            data: data.values,
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
            addData(dateString.split(" ")[1].slice(0, -3), data.count);
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