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

## SIGNAL: message
회원이 참여하고있는 채팅방에 누군가가 (본인 포함) 메시지를 전송할 경우에 대한 이벤트를 다음과 같이 수신할 수 있다.
```javascript
socket.on('messasge', (payload) => {
  console.log(payload);
});
```
발송한 메시지의 payload는 다음과 같은 형태를 가진다.
```json
{
   "message_id":"626446794155fd69c1b90b827b3d6931", // 메시지 ID
   "type":"TEXT", 
   "from":{ // 보낸 사람 정보
      "token":"a6b365d853295c532f988916fb5413a2ab64a39c831c0292",
      "nick":{
         "en":"humble squid",
         "ko":"겸손한 꼴뚜기",
         "ja":"謙虚なるい"
      },
      "avatar":{
         "profile_img":"http://dev-cdn.chatpot.chat/77975cfec23541f689e4d60d499ffd2d07e4325bbb043e4b80f803c4c515e536.png",
         "profile_thumb":"http://dev-cdn.chatpot.chat/thumb_77975cfec23541f689e4d60d499ffd2d07e4325bbb043e4b80f803c4c515e536.jpg"
      },
      "region":"KR",
      "language":"ko",
      "gender":"M"
   },
   "to":{ // 발송 대상 정보
      "type":"ROOM",
      "token":"26ef038d7696b09ec88bd788a64fbc2e5de58333a3785c98"
   },
   "content":"호옹", // 메시지 컨텐츠
   "sent_time":1557896925469 // 발송시간
}
```