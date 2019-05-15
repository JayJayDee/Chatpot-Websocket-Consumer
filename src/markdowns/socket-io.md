# SocketIO 통신 프로토콜 설명
이 문서에서는 Chatpot Server와 Frontend Page간 SocketIO 통신에 대해서 설명하도록 한다.

## SocketIO 노드 연결
먼저, [API문서](http://dev-websocket.chatpot.chat/apidoc/#/Status/get_status)에서 설명하는 API의 호출 결과값을 이용하여 최적의 SocketIO 노드와 연결을 맺는다.
```json
{
  "host": "http://dev-ws-1.chatpot.chat",
  "port": 80,
  "num_connection": 0
}
```
위의 host, port값을 이용하여 socket.io-client를 이용하여 다음과 같이 연결한다.
```javascript
const socket = io('http://dev-ws-2.chatpot.chat');
socket.on('connection', () => {
  console.log('connected!');
});
```

## SIGNAL: server_error
SocketIO 노드 연결 후 서버 상에서 발생하거나 유저의 동작을 어떠한 이유로 거부하는 경우 `server_error` 이벤트가 SocketIO 노드로부터 반환된다.
다음과 같이 `server_error` 이벤트를 수신할 수 있다.
```javascript
socket.on('server_error', (payload) => {
  console.log('SERVER_ERROR!');
  console.log(payload);
});
```
`server_error` 이벤트의 데이터 포맷은 다음과 같다.
```json
{
  "code": "INVALID_PARAM", // 에러 코드
  "message": "invalid member_token" // 에러 상세 이유
}
```

## SIGNAL: postinit_req
SocketIO 노드와 연결이 성립한 후 회원 token을 parameter로 다음과 같이 전송한다.
```javascript
socket.emit('postinit_req', {
  token: 'a6b365d853295c532f988916fb5413a2ab64a39c831c0292'
});
```
서버에서의 처리가 완료되면 `postinit_res` 이벤트가 SocketIO노드로부터 반환된다.
```javascript
socket.on('postinit_res', (payload) => {
  console.log('POSTINIT_SUCCESS!');
  console.log(payload); // { "success": true }
});
```