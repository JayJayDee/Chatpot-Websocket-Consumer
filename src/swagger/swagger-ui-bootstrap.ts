const jsdoc = require('swagger-jsdoc');
import { injectable } from 'smart-factory';
import { SwaggerModules } from './modules';

const apiDocOptions = {
  apis: [`${__dirname}/*.yaml`],
  swaggerDefinition: {
    info: {
      title: 'Chatpot-Websocket-API',
      description: 'Chatpot websocket cluster loadbalacing APIs <br /><br />Socket.IO 통신 프로토콜 문서는 <a href="http://dev-websocket.chatpot.chat/socketio-doc">다음</a>을 참조하도록 한다.',
      version: '1.0.0'
    }
  },
};

injectable(SwaggerModules.SwaggerConfigurator,
  [],
  async () => jsdoc(apiDocOptions));