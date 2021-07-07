function update_graph(data) {
    var ctx = document.getElementById('main-chart');
    const labels = ["January", "", "March", "", "May", "June",
        "July", "August", "September", "October", "November", "December", "January", "", "March", "", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const data = {
        labels: labels,
        datasets: [{
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40, 35, 33, 32, 31, 65, 59, 80, 81, 56, 55, 40, 35, 33, 32, 31, 12, 13],
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
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function update_numbers(data) {

}

(function worker() {
    $.ajax({
        url: 'getFreeSeats',
        data: {
            date: "today"
        },
        success: function(data) {
            update_graph(data);
            update_numbers(data);
        },
        complete: function() {
            const d = new Date();
            let dateString = d.toLocaleString();
            $("#date").html(dateString);
            let year = d.getFullYear();
            let month = d.getMonth();
            let day = d.getUTCDay();
            setTimeout(worker, 5000);
        }
    });
})();