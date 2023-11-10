const Cloud = require('@google-cloud/storage');

const { Storage } = Cloud
const storage = new Storage({
  keyFilename: serviceKey,
  projectId: 'oi-eco',
})

module.exports = storage;