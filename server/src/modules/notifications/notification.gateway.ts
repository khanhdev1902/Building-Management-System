/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly jwtService: JwtService) {
    console.log('hahahah', jwtService);
  }

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token as string;

      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);

      console.log('payload:', payload);

      const userId = payload.sub as string;

      console.log('userId:', userId);

      client.join(userId);

      console.log(client.rooms);
    } catch (error) {
      console.error('Socket auth failed:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  sendNotification(userId: string, payload: unknown) {
    console.log('rooms:', [...this.server.sockets.adapter.rooms.keys()]);

    console.log(
      'sockets in room:',
      this.server.sockets.adapter.rooms.get(userId),
    );

    this.server.to(userId).emit('notification', payload);
  }
  sendNotificationTenantDashBoard(userId: string, payload: unknown) {
    console.log('rooms:', [...this.server.sockets.adapter.rooms.keys()]);

    console.log(
      'sockets in room:',
      this.server.sockets.adapter.rooms.get(userId),
    );

    this.server.to(userId).emit('dashboardTenant', payload);
  }
}
