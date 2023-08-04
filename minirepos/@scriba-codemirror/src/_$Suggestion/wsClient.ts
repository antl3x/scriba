import { _useStoreOfSettings } from '$Main';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

export let _wsClient: Socket;

_useStoreOfSettings.subscribe((i) => {
  if (!i || _wsClient) return;

  console.debug('[@scriba/obsidian] starting websocket client', i);

  _wsClient = io(i.apiProxyEndpoint || 'https://api.usescriba.com', {
    transports: ['websocket'],
    auth: {
      token: i.authUserJWT,
    },
    extraHeaders: {
      Authorization: 'Bearer' + i.authUserJWT,
    },
  });

  _wsClient.on('connect_error', (err) => {
    console.log(`[@scriba/obsidian] ws connect_error due to ${err.message}`);
  });
});
