import multer from 'multer';
 
//why multer is used in this project?
//Multer is a middleware for handling multipart
// /form-data, which is primarily used for 
// uploading files. In this project, multer is 
// used to handle file uploads from the client 
// side, allowing users to upload images or other
//  files to the server. The configuration 
// specifies where the uploaded files should be
//  stored and how they should be named to ensure 
// that each file has a unique name and is saved
//  in the correct location.

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });