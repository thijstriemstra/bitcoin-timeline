function handleFileSelect()
{
    if (window.File && window.FileReader && window.FileList && window.Blob) {

    } else {
        alert('The File APIs are not fully supported in this browser.');
        return;
    }

    input = document.getElementById('fileinput');
    if (!input) {
        alert("Um, couldn't find the fileinput element.");
    }
    else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");
    }
    else
    {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = receivedText;
        fr.readAsText(file);
    }
}


var myChart;
var transactions = new Transactions();

var bpi_chart_data = {
    labels : [],
    label : "Bitstamp BPI in USD",
    data: []
};


var transactions_chart_data = {
    labels : [],
    label : "Transaction in USD",
    data: [],
    rawData: []
};


function buildChart(data) {
    
    var ctx = document.getElementById("myChart");
    // build graph
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: bpi_chart_data.labels,
            datasets: [{
               label: bpi_chart_data.label,
               data: bpi_chart_data.data,
               strokeColor: "rgba(220,220,220,1)",
               pointColor: "rgba(220,220,220,1)",
               pointStrokeColor: "#fff",
               lineTension: 0.1,
               backgroundColor: "rgba(75,192,192,0.4)",
               borderColor: "rgba(75,192,192,1)",
               borderCapStyle: 'butt',
               borderDash: [],
               borderDashOffset: 0.0,
               borderJoinStyle: 'miter',
               pointBorderColor: "rgba(75,192,192,1)",
               pointBorderWidth: 1,
               pointHoverRadius: 5,
               pointHoverBackgroundColor: "rgba(75,192,192,1)",
               pointHoverBorderColor: "rgba(220,220,220,1)",
               pointHoverBorderWidth: 2,
               pointRadius: 1,
            },
            {
               label: transactions_chart_data.label,
               data: transactions_chart_data.data,
               fillColor: "rgba(220,220,220,.2)",
               pointColor: "rgba(151,187,205,1)",
               pointStrokeColor: "#fff",
               lineTension: 0.1,
               backgroundColor: "rgba(151,187,205,1)",
               borderColor: "rgba(151,187,205,1)",
               borderCapStyle: 'butt',
               borderDash: [],
               borderDashOffset: 0.0,
               borderJoinStyle: 'miter',
               pointBorderColor: "rgba(151,187,205,1)",
               pointBorderWidth: 1,
               pointHoverRadius: 5,
               pointHoverBackgroundColor: "rgba(151,187,205,1)",
               pointHoverBorderColor: "rgba(220,220,220,1)",
               pointHoverBorderWidth: 2,
               pointRadius: 1,
               spanGaps: true
           }]
         },
         options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
}


function parseBPI(data) {
    //console.log(data);

    for (var i in data.bpi) {
        // label, e.g. 2014-07-04
        bpi_chart_data.labels.push(i);
        // data (price in dollars)
        bpi_chart_data.data.push(parseFloat(data.bpi[i]));
    }
}


function parseCSV(input) {
    //
    Papa.parse(input, {
        worker: true,
        header: true,
        step: function(results) {            
            var item = results.data[0];

            // console.info(item);

            function pad(n){return n<10 ? '0'+n : n}

            var timestamp = Date.parse(item.Datetime.replace(".", ""));
            var now = new Date(timestamp);
            var year = now.getFullYear().toString();
            var month = (now.getMonth() + 1).toString();
            var day = now.getDate().toString();

            var transaction = new Transaction({
                subType: item['Sub Type'],
                value: parseFloat(item.Value.replace(" USD", "")),
                amount: parseFloat(item.Amount.replace(" BTC", "")),
                // Deposit/Market/Withdrawal
                type: item.Type,
                accountName: item.Account,
                rate: parseFloat(item.Rate.replace(" USD", "")),
                fee: parseFloat(item.Fee.replace(" USD", "")),
                timestamp: timestamp,
                datestring: year + "-" + pad(month) + "-" + pad(day)
            });

            if (transaction.get('value') && transaction.isBuy()) {
                // label, e.g. 2014-07-04
                transactions_chart_data.labels.push(transaction.get('datestring'));
                transactions_chart_data.data.push(transaction.get('value'));
            }

            transactions_chart_data.rawData.push(transaction);
            
            transactions.add(transaction);
        },

        complete: function(results) {
            console.log('Completed loading transactions CSV.');

            console.log('current price (USD)', transactions.currentPrice.rate);

            // Market (Buy)
            var total_spent = transactions.total_spent();
            var total_bought = transactions.total_bought();
            var total_fees = transactions.total_fees();

            var lowest_rate = transactions.lowest_rate();
            var highest_rate = transactions.highest_rate();

            console.log('total spent (USD)', total_spent);
            console.log('total bought (BTC)', total_bought);
            console.log('total bought value with current price (USD)', transactions.currentPrice.rate * total_bought);
            console.log('total fees (USD)', total_fees);
            console.log('lowest rate per bitcoin (USD)', lowest_rate);
            console.log('highest rate per bitcoin (USD)', highest_rate);

            // Withdrawal
            var total_withdrawal = transactions.total_withdrawal();

            console.log('total withdrawal (BTC)', total_withdrawal);

            // _.range(bpi_chart_data.labels.length);

            buildChart(transactions_chart_data);
        }
    });
}

function receivedText() {
    // load bpi
    var bpi = getJSON('../bpi.json').then(function(result) {
        console.log("Loaded BPI: ", result);

        parseBPI(result);
        
        // parse csv
        parseCSV(fr.result);
    });
}