import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Socket as ioSocket } from 'socket.io-client';
import { environment } from '@env/environment';
import { tap } from 'rxjs/operators'
import { UserService } from './user.service';
import { Usuario } from '@app/models/usuario';
import { MsgService } from './msg.service';
import { CryptoService } from './crypto.service';
import { ThrowStmt } from '@angular/compiler';
import { Msg } from '@app/models/msg';

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  constructor(private socket: Socket,
    private userService: UserService,
    private msgService: MsgService,
    private cryptoService: CryptoService) {

    this.socket.on("connect_error", (err: any) => {
      if (err.message === "invalid username") {
        console.log("invalid username");
        localStorage.removeItem("sessionID");
      }
    });

    this.socket.on('session', (session: any) => {
      console.log('session');
      this.socket.ioSocket.auth = { sessionID: session.sessionID };
      localStorage.setItem("sessionID", session.sessionID);
      localStorage.setItem("userID", session.userID);
      this.socket.ioSocket.userID = session.userID;
    });

    this.socket.on("users", (users: Usuario[]) => {
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if(user.userID === socket.ioSocket.userID)
          return;
        this.ping(user.userID)
        userService.addUsuario(user);
      }
    });

    this.socket.on("user disconnected", (id: string) => {
      console.log("user desconnected");
      userService.updateStatus(id, false);
    });

    this.socket.on("private message", (msg: Msg) => {
      console.log("msg recebida: ", msg);
      const crypt = new Uint8Array(msg.content);
      this.userService.find(msg.from).subscribe(sender => {
        this.cryptoService.decrypt(crypt).then(desc => {
          this.msgService.addMessage(msg.from, {
            text: desc,
            date: new Date(),
            reply: false,
            type: 'text',
            sender: sender.username,
            avatar: 'https://i.gifer.com/no.gif',
          });
        });
      });

    });

    this.socket.on("ping", (msg: any) => {
      this.cryptoService.addUserPublicKey(msg.from, msg.key);
      this.socket.emit("pong", { key: this.cryptoService.publicKey, to: msg.from })
    });

    this.socket.on("pong", (msg: any) => {
      this.cryptoService.addUserPublicKey(msg.from, msg.key);
    });

  }

  setUsername(user: string) {
    this.socket.ioSocket.auth = { username: user }
    this.socket.connect();
  }

  getUsers() {
    return this.socket.fromEvent("users").pipe(tap(console.log));
  }

  userConnected() {
    return this.socket.fromEvent("user connected").pipe(tap(console.log));
  }

  ping(id: string) {
    if (!this.cryptoService.verifyKeyUser(id))
      this.socket.emit("ping", { key: this.cryptoService.publicKey, to: id })
  }

  send(content: Uint8Array, username: string) {

    this.socket.emit("private message", {
      content,
      to: username
    });

  }

  receive() {
    return this.socket.fromEvent("private message")
      .pipe(tap(console.log));
  }
}
