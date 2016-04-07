angular.module('marshalApp')
    .service('dragDrop', ['courseHandler', DragDrop]);
    
function DragDrop(courseHandler) {
    this.dragEnter = function dragEnter(ev) {
        ev.preventDefault();
    }
    
    this.allowDrop = function allowDrop(ev) {
        ev.preventDefault();
    }

    this.drop = function drop(ev) {
        var reader = new FileReader();
        reader.onloadend = function() {
            try {
                var data = JSON.parse(this.result);
                
                // Adding the course to the table
                courseHandler.addCourse(data)
            } catch (e) {
                alert("Bad file");
            }
        };
        
        reader.onprogress = function(event) {
            if (event.lengthComputable) {
                // progressNode.max = event.total;
                // progressNode.value = event.loaded;
            }
        };
        
        reader.readAsText(event.dataTransfer.files[0]);
        event.preventDefault();
    }
}