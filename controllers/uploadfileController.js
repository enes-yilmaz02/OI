const {format} = require('util');
const Multer = require('multer');

const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

const uploadFiles = multer.array('filename', 5); // 'filename' burada formdaki dosya alanının adıdır, 5 ise aynı anda kaç dosya yüklenebileceğini belirtir.

 // A bucket is a container for objects (files).
 const bucket = storage.bucket(process.env.STORAGE_BUCKET);
const uploadFile=(uploadFiles, (req, res, next) => {
  // Birden çok dosya yüklendiği için req.files kullanılır.
  if (!req.files || req.files.length === 0) {
    res.status(400).json({ message: 'No files uploaded.' });
    return;
  }

  // Dosyaları işleyin ve işleme devam edin...
  const promises = req.files.map((file) => {
    const blob = bucket.file(`files/${file.originalname}`);
    const blobStream = blob.createWriteStream();

    return new Promise((resolve, reject) => {
      blobStream.on('error', reject);

      blobStream.on('finish', () => {
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  });

  // Tüm dosya işlemleri tamamlandığında kullanıcıya cevap gönderin.
  Promise.all(promises)
    .then((urls) => {
      res.status(200).json({ urls });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error processing files.' });
    });
});
module.exports={
  uploadFile
}