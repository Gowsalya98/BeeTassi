const multer = require('multer')
const fs = require('fs');


// var maxSize = 1 * 1000 * 1000;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var fileCreate = '/home/fbnode/NODE_GOWSI/uploads/BeeTassi/'
        if (!fs.existsSync('fileCreate')) {
            fs.mkdirSync(fileCreate, {
                recursive: true
            });
        }
        cb(null, '/home/fbnode/NODE_GOWSI/uploads/BeeTassi/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now().toString() + file.originalname);
    },
    onFileUploadStart: function (file, req, res) {
        if (req.files.file.length > maxSize) {
            return false;
        }
    }
});
const fileFilters = (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
        cb(null, true)

    } else {
        cb(null, false)
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilters })

module.exports = { upload }