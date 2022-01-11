import { Logger } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class UsersEventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() 
	server: Server;

	private logger: Logger = new Logger('UsersEventGateway')

	@SubscribeMessage('events')
	handleMessage(client: Socket, data: string): string {
		this.logger.log('LOGGER!: ', data)
		return data
	}

	afterInit(server: Server): void {
		this.logger.log('INIT', server)
	}

	handleDisconnect(client: Socket) {
		this.logger.log('DISCONNECTED', client)
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log('Connected', client, args)
	}
}