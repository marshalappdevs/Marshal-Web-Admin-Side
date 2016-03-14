angular.module('marshalApp')
    .service('dragDrop', ['courseHandler', DragDrop]);
    
function DragDrop(courseHandler) {
    var showSplash = { show: false };
    
    this.dragEnter = function dragEnter(ev) {
        ev.preventDefault();
        showSplash.show = true;
    }
    
    this.allowDrop = function allowDrop(ev) {
        ev.preventDefault();
    }

    this.drop = function drop(ev) {
        var reader = new FileReader();
        reader.onloadend = function() {
            try {
                var data = JSON.parse(this.result);
            } catch (e) {
                alert("Bad file");
            }
            
            console.log(data);
            courseHandler.addCourse(data)
        };
        
        reader.onprogress = function(event) {
            if (event.lengthComputable) {
                // progressNode.max = event.total;
                // progressNode.value = event.loaded;
            }
        };
        
        reader.readAsText(event.dataTransfer.files[0]);
        event.preventDefault();
        
        showSplash.show = false;
    }
    
    this.showSplash = function() {
        return showSplash;
    }
}