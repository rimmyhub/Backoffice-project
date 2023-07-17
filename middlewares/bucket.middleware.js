// 예시입니다!
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_BUCKET_REGION,
});

class UploadBucket {
  constructor() {
    // 프로필 사진 저장 경로
    this.profileImageDir = 'images/profile';
  }

  // 버킷 업로드 틀
  upload = (saveDir) =>
    multer({
      storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        shouldTransform: true, // 뭘 트랜스폼 한다는거지?
        key: (req, file, callback) => {
          callback(null, `${saveDir}/${Date.now()}_${uuidv4()}`);
        },
        acl: 'public-read-write',
        limits: { fileSize: 5 * 1024 * 1024 }, // 이미지 용량을 5MB이하로 제한
        contentType: multerS3.AUTO_CONTENT_TYPE, // 파일의 Content-Type 자동 설정
        metadata: (req, file, callback) => {
          callback(null, { fieldName: file.fieldname });
        },
      }),
    });

  // 프로필 사진 버킷 업로드
  profileImage = (targetFile) => this.upload(this.profileImageDir).single(targetFile);
}

module.exports = UploadBucket;
