const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {
    renderMain,
    renderRoom,
    createRoom,
    enterRoom,
    removeRoom,
    sendChat,
    sendGif,
} = require('../controllers');
const router = express.Router();

router.get('/', renderMain);
router.get('/room', renderRoom);
router.post('/room', createRoom);
router.get('/room/:id', enterRoom);
router.delete('/room/:id', removeRoom);
router.post('/room/:id/chat', sendChat);
// multer 미들웨어
try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads폴더가 없어서 생성합니다');
    fs.mkdirSync('uploads');
}
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(
                null,
                path.basename(file.originalname, ext) + Date.now() + ext
            );
        },
    }),
});
router.post('/room/:id/gif', upload.single('gif'), sendGif);

module.exports = router;
