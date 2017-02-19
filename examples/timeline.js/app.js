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

function receivedText() {
    var result = JSON.parse(fr.result);
    console.log(result);

    // XXX: load directly from bitstamp
    //var link = 'https://bitstamp.net/etc/test.json'
    //var result= JSON.parse(link);

    // two arguments: the id of the Timeline container (no '#')
    // and the JSON object or an instance of TL.TimelineConfig created from
    // a suitable JSON object
    window.timeline = new TL.Timeline('timeline-embed', result);
}