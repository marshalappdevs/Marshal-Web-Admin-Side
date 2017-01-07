var multer = require('multer');
var path = require('path');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images/'))
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});
/////
module.exports = multer({ //multer settings
                     storage: storage
                 }).single('file');