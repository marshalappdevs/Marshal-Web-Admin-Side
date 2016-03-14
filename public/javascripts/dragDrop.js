function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    var reader = new FileReader();
    reader.onloadend = function() {
        try {
            var data = JSON.parse(this.result);
        } catch (e) {
            alert("Bad file");
        }
        
        console.log(data);
    };
    
    reader.readAsText(event.dataTransfer.files[0]);
    event.preventDefault();
}