let today = {labels:[], values:[], Cap:"450"};
let last_week = {
    labels: {

    }
}

// update graph
function update_graph(data) {
    console.log(data);
    var ctx = document.getElementById('main-chart');
    const labels = ["January", "", "March", "", "May", "June",
        "July", "August", "September", "October", "November", "December", "January", "", "March", "", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const dat = {
        labels: data.labels,
        datasets: [{
            label: 'My First Dataset',
            data: data.values,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }],
        xAxes: [{
            type: 'time',
            ticks: {
                autoSkip: true,
                maxTicksLimit: 4
            }
        }]
    };
    var myChart = new Chart(ctx, {
        type: 'line',
        data: dat,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// update numbers on top of page
function update_numbers(data) {
    $("#free-seats-number").html(data.cap-data.count);
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
            // update_graph(data);
            update_numbers(data);
        },
        complete: function() {
            const d = new Date();
            let dateString = d.toLocaleString();
            $("#date").html(dateString);
            let year = d.getFullYear();
            let month = d.getMonth();
            let day = d.getUTCDay();
            setTimeout(worker, 3000);
        }
    });
})();
