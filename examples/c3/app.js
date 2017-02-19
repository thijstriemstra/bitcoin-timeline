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
        events: []
};

function processHistory(data) {

    console.log("data: ", data);

    var values = data.forEach( function (item) {
        return item.Value;
    });
    
    console.log(values);
    
    var chart = c3.generate({
        bindto: '#chart',
        data: {
          columns: [
            ['data1', 30, 200, 100, 400, 150, 250]
          ]
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
            
            //console.info(item);
            
            var timestamp = Date.parse(item.Datetime.replace(".", ""));
            var now = new Date(timestamp);
            var year = now.getFullYear().toString();
            var month = (now.getMonth() + 1).toString();
            var day = now.getDate().toString();

            var event = {
                    "start_date": {
                        "month": month, 
                        "day": day,
                        "year": year
                    },
                    "text": {
                        "headline": item.Type + ': ' + item.Amount,
                        "text": "<span data-value='"+ item.Value +"'>" + item.Account + "</span>"
                    }
            };
            
            example.events.push(event);
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