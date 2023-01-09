const Room = require('../schemas/room');
const Chat = require('../schemas/chat');
const { removeRoom: removeRoomService } = require('../services');

exports.renderMain = async (req, res, next) => {
    try {
        const rooms = await Room.find({});
        res.render('main', { rooms, title: '채팅방' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
exports.renderRoom = async (req, res, next) => {
    res.render('room', { title: '채팅방 생성' });
};
exports.createRoom = async (req, res, next) => {
    try {
        const newRoom = await Room.create({
            title: req.body.title,
            max: req.body.max,
            owner: req.session.color,
            password: req.body.password,
        });
        const io = req.app.get('io');
        io.of('/room').emit('newRoom', newRoom);

        // 방에 들어가는 부분
        if (req.body.password) {
            res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
        } else {
            res.redirect(`/room/${newRoom._id}`);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};
exports.enterRoom = async (req, res, next) => {
    try {
        const room = await Room.findOne({ _id: req.params.id });
        if (!room) {
            return res.redirect('/?error=존재하지 않는 방');
        }
        if (room.password && room.password !== req.query.password) {
            return redirect('/?error=비밀번호 틀렸어용');
        }
        const io = req.app.get('io');
        const { rooms } = io.of('/chat').adapter;

        // rooms.get(req.params.id)?.size : 소켓 개수(참가자 인원)
        if (room.max <= rooms.get(req.params.id)?.size) {
            return res.redirect('/?error=허용 인원 초과!');
        }
        res.render('chat', {
            title: '채팅방 생성',
            chats: [],
            user: req.session.color,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
exports.removeRoom = async (req, res, next) => {
    try {
        await removeRoomService(req.params.id);
        res.send('삭제완료');
    } catch (error) {
        console.error(error);
        next(error);
    }
};
