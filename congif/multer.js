// const multer =require('multer')
// const { CloudinaryStorge }= require("multer-storage-cloudinary")
// const cloudinary = require("./cloudinary")
// // const { param } = require('../controllers/auth.controller')

// const storage = CloudinaryStorge({
//     cloudinary: cloudinary,
//     params:{
//         folder: 'marketplace-listing',
//         allowed_formats:["jpg",'jpeg','png']
//     }
// })

const multer = require('multer');
// const { v2: cloudinary } = require('cloudinary');
const cloudinary = require('./cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'marketplace',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});
// const upload = multer({ storage: storage });
module.exports = multer({storage:storage})