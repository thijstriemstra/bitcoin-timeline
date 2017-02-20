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
        data : ["BTC value (USD)"],
        dates : ["x"]
};

function processHistory(data) {

    console.log("data: ", data);

    var items = [];
    
    for (var i=0; i<data.length; i++) {
        
    }
    
    
    var chart = c3.generate({
        bindto: '#chart',
       
        data: {
          columns: [data.data, data.dates],
          x: 'x',
        },
        axis : {
            x : {
                type : 'timeseries',
                label: 'yo yo',
                position: 'inner-left',
                tick: {
                    fit: true,
                    format: "%e %b %y"
                }
            }
        }
    });


}

function parseCSV(input) {
    //
    Papa.parse(input, {
        worker: true,
        header: true,
        step: function(results) {            
            var item = results.data[0];
            
            console.info(item);
            
            var timestamp = Date.parse(item.Datetime.replace(".", ""));
            var now = new Date(timestamp);
            var year = now.getFullYear().toString();
            var month = (now.getMonth() + 1).toString();
            var day = now.getDate().toString();
            var datestring = year + "-" + month + "-" + day;
            
            var value = item.Value.replace(" USD", "");

            if (value) {
                example.data.push(value);
                example.dates.push(datestring);
            } 
        },
        
        complete: function(results) {
            console.log('completed loading CSV.');
            processHistory(example);
        }
    });
}

function receivedText() {

    parseCSV(fr.result);
    
    //console.log(example);
    
    

    // XXX: load directly from bitstamp
    //var link = 'https://bitstamp.net/etc/test.json'
    //var result= JSON.parse(link);
    
    // var example = JSON.parse(fr.result);
    // console.log(example);
}