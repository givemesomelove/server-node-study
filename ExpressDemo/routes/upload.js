const express = require('express');
const multer = require('multer');
const router = express.Router();
const { httpAuth } = require('../middleware/auth');

// 配置 Multer
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 100 * 1024 * 1024 }, // 限制100MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new multer.MulterError('仅支持图片文件'));
        }
    }
});

// 文件上传路由
router.post('/', httpAuth, upload.single('file'), (req, res) => {
    console.log('文件上传请求收到');
    res.json({
        filename: req.file.originalname,
        size: req.file.size
    });
});

// 错误处理
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(400).json({
            error: `上传失败: ${err.message}`,
            code: err.code
        });
    } else {
        res.status(500).json({ error: '服务器错误' });
    }
});

module.exports = router;