const SocketIO = require('socket.io');

module.exports = (server) => {
    const io = SocketIO(server, { path: '/socket.io' });

    io.on('connection', (socket) => {
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log('새로운 클라이언트 접속', ip, socket.id, req.ip);
        socket.on('disconnect', () => {
            console.log('클라이언트 접속 해제', ip, socket.id, req.ip);
            clearInterval(socket.interval); // 접속 끊어지면 Interval도 더 이상 안되도록 설정
        });
        socket.on('reply', (data) => {
            console.log(data);
        });

        socket.on('error', console.error);
        /** 서버에서 2초마다 메시지 보내줌 */
        socket.interval = setInterval(() => {
            socket.emit('news', 'Hello Socket.IO');
        }, 2000);
    });
};
