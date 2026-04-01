import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Appointment } from '../entities/appointment.entity';
import { AuthService } from '../auth/auth.service';
import { NotificationEntity } from '../entities/notification.entity';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'http://192.168.1.106:5173'],
    credentials: true,
  },
})
export class AppointmentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private static readonly SALON_ROOM = 'salon:main';

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async handleConnection(client: any) {
    try {
      const token = this.extractToken(client);
      if (!token) throw new UnauthorizedException('Missing token');

      const payload = await this.jwtService.verifyAsync(token, {
        secret:
          this.configService.get<string>('JWT_SECRET') || 'your-secret-key',
      });
      const userId = Number(payload?.sub);
      if (!userId) throw new UnauthorizedException('Invalid token payload');

      const user = await this.authService.validateUser(userId);
      client.data = client.data || {};
      client.data.user = { id: user.id, email: user.email };

      client.join(AppointmentsGateway.SALON_ROOM);
      client.join(`user:${user.id}`);
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: any) {
    // socket.io gère la sortie des rooms automatiquement
    void client;
  }

  emitAppointmentCreated(appointment: Appointment) {
    // Broadcast salon room (tous les dashboards connectés)
    this.server.to(AppointmentsGateway.SALON_ROOM).emit(
      'appointment.created',
      appointment,
    );
  }

  emitAppointmentCreatedToUser(userId: number, appointment: Appointment) {
    this.server.to(`user:${userId}`).emit('appointment.created', appointment);
  }

  emitNotificationCreatedToUser(userId: number, notification: NotificationEntity) {
    this.server.to(`user:${userId}`).emit('notification.created', notification);
  }

  private extractToken(client: any): string | undefined {
    const authToken = client?.handshake?.auth?.token;
    if (typeof authToken === 'string' && authToken.trim()) return authToken;

    const cookieHeader = client?.handshake?.headers?.cookie as
      | string
      | undefined;
    if (!cookieHeader) return undefined;

    // cookie: "a=b; access_token=xxx; c=d"
    const parts = cookieHeader.split(';').map((p: string) => p.trim());
    const match = parts.find((p: string) => p.startsWith('access_token='));
    if (!match) return undefined;
    return decodeURIComponent(match.substring('access_token='.length));
  }
}

