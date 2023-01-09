const SocketIO = require('socket.io');

module.exports = (server, app) => {
    const io = SocketIO(server, { path: '/socket.io' });
    app.set('io', io);
    // 네임스페이스 장착
    const room = io.of('/room');
    const chat = io.of('/chat');

    room.on('connection', (socket) => {
        console.log('room 네임스페이스 접속');
        socket.on('disconnect', () => {
            console.log('room 네임스페이스 접속 해제');
        });
    });
    chat.on('connection', (socket) => {
        console.log('chat 네임스페이스 접속');
        socket.on('join', (data) => {
            socket.join(data); // 방에 참가
        });
        socket.on('disconnect', () => {
            console.log('chat 네임스페이스 접속 해제');
        });
    });
};
