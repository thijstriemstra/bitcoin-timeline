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

let example = {
        "title": {
            "media": {
              "url": "//blog.cex.io/wp-content/uploads/2015/03/market-price.png",
              "caption": "B-Boys money makin'",
              "credit": "flickr/<a href='http://yo.mom'>@thijstriemstra @ikbensiep</a>"
            },
            "text": {
              "headline": "I know what you deposited last summer<br/> 2013 - 2016",
              "text": "<p>Bitch I'm a bus'.</p>"
            }
        },
        "events": []
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
            
            // two arguments: the id of the Timeline container (no '#')
            // and the JSON object or an instance of TL.TimelineConfig created from
            // a suitable JSON object
            window.timeline = new TL.Timeline('timeline-embed', example);
        }
    });
}

function receivedText() {

    parseCSV(fr.result);
    
    console.log(example);

    // XXX: load directly from bitstamp
    //var link = 'https://bitstamp.net/etc/test.json'
    //var result= JSON.parse(link);
    
    // var example = JSON.parse(fr.result);
    // console.log(example);
}