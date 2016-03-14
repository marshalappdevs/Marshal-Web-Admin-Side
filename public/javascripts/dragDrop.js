function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    var reader = new FileReader();
    reader.onloadend = function() {
        var data = JSON.parse(this.result);
        console.log(data);
    };

    reader.readAsText(event.dataTransfer.files[0]);    
    event.preventDefault();
}