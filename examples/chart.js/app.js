var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};

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


var example = {
        labels : [],
        label : "BTC Transexual Values",
        data: []
};

function parseCSVDone(data) {
    console.log("data: ", data);

    
}

function parseBPI(data) {
    
    //parseCSV(fr.result);
        
    var ctx = document.getElementById("myChart");
    
    //console.log(data);
    
    for (var i in data.bpi) {
        // console.log(i, data.bpi[i])
        example.labels.push(i);
        example.data.push(data.bpi[i]);
    }

    // build graph
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: example.labels,
            datasets: [{
                label: example.label,
                data: example.data
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


// 1: load csv
// 2: load bpi
// 3: chart

function parseCSV(input) {
    //
    Papa.parse(input, {
        worker: true,
        header: true,
        step: function(results) {            
            var item = results.data[0];
            
            // console.info(item);
            
            var timestamp = Date.parse(item.Datetime.replace(".", ""));
            var now = new Date(timestamp);
            var year = now.getFullYear().toString();
            var month = (now.getMonth() + 1).toString();
            var day = now.getDate().toString();
            var datestring = year + "-" + month + "-" + day;
            
            var value = item.Value.replace(" USD", "");

            if (value) {
                example.data.push(value);
                example.labels.push(datestring);
            } 
        },
        
        complete: function(results) {
            console.log('completed loading CSV.');
            parseCSVDone(example);
        }
    });
}

function receivedText() {

    var bpi = getJSON('../bpi.json').then(function(result){
        console.log("BPI: ", result);
        
        parseBPI(result);
        
        
        
    });
    
//    parseCSV(fr.result);
    
    //console.log(example);
}