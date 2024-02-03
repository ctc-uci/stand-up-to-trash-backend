const express = require('express');
const aws = require('aws-sdk');
const crypto = require('crypto');

const s3UploadRouter = express.Router();

// initialize a S3 instance
const s3 = new aws.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
});

// get a S3 URL
s3UploadRouter.get('/', async (req, res) => {
  try {
    // generate a unique name for image
    const rawBytes = await crypto.randomBytes(16);
    const imageName = rawBytes.toString('hex');

    // set up s3 params
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: imageName,
      Expires: 60,
    };

    // get a s3 upload url
    const uploadURL = await s3.getSignedUrl('putObject', params);
    res.status(200).send(uploadURL);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = s3UploadRouter;
