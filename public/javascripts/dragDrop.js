function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    var reader = new FileReader();
    reader.onloadend = function() {
        var data = JSON.parse(this.result);
        console.log(data);
    };

    // Checks if file is JSON
    if (!event.dataTransfer.files[0].type.match('application/json')) {
        alert("Bad file");
    } else {
        reader.readAsText(event.dataTransfer.files[0]);
    }
    
    event.preventDefault();
}