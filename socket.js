const WebSocket = require('ws');

module.exports = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req) => {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        console.log('새로운 클라이언트 접속', ip);
        ws.on('message', (message) => {
            console.log(message.toString()); // buffer -> string
        });
        ws.on('error', console.error);
        ws.on('close', () => {
            console.log('클라이언트 접속 해제', ip);
            clearInterval(ws.interval); // 접속 끊어지면 Interval도 더 이상 안되도록 설정
        });
        /** 서버에서 2초마다 메시지 보내줌 */
        ws.interval = setInterval(() => {
            if (ws.readyState === ws.OPEN) {
                ws.send('서버에서 클라이언트로 메시지를 보냅니다');
            }
        }, 2000);
    });
};
