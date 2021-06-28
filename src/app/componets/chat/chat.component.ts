import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { CryptoService } from '../../services/crypto.service';
import { Message } from '../../models/message';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Usuario } from '@app/models/usuario';
import { UserService } from '@app/services/user.service';
import { MsgService } from '@app/services/msg.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  messages$!: Observable<Message[]>;
  user$ !: Observable<Usuario>;

  constructor(
    private route: ActivatedRoute,
    private crypt: CryptoService,
    private chat: ChatService,
    private userService: UserService,
    private msgService: MsgService) {}

  ngOnInit(): void {

    this.messages$ = this.route.paramMap.pipe(
      switchMap((params : ParamMap) => this.msgService.getMessages(params.get('id')!))
    );
    
    this.user$ = this.route.paramMap.pipe(
      switchMap((params : ParamMap) => this.userService.find(params.get('id')!))
    )

  }

  sendMessage(event: any) {

    this.userService.find(this.route.snapshot.paramMap.get('id')!).subscribe(user => {
      const key = this.crypt.getUserPublicKey(user.userID);
      this.crypt.encrypt(event.message, key).then(msg => {
        this.chat.send(msg, this.route.snapshot.paramMap.get('id')!);
      });  
    

    this.msgService.addMessage(this.route.snapshot.paramMap.get('id')!,{
      text: event.message,
      date: new Date(),
      reply: true,
      type: 'text',
      sender: '',
      avatar: 'https://i.gifer.com/no.gif',
    });



    });

    

  }

}
