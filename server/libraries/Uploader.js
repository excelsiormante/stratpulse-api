var multer =  require('multer');
var path = require('path');

var storage = multer.diskStorage({ //multers disk storage settings
	destination: function (req, file, cb) {
	    cb(null, path.join(appRoot, 'assets/uploads'))
	},
	filename: function (req, file, cb) {
	    var datetimestamp = Date.now();
	    cb(null, datetimestamp + '-' + file.originalname)
	}
});

var upload = multer({ //multer settings
                storage: storage
            }).single('file');



function uploadImage(req, res){
	upload(req,res,function(err){
        if(err){
        	console.log(err);
             res.json({error_code:1,err_desc:err});
             return;
        }
         res.json({error_code:0,err_desc:null});
    });
}

module.exports = {uploadImage};