import { Component, OnInit } from '@angular/core';
import { Message } from '@app/models/message';
import { ChatService } from '@app/services/chat.service';
import { CryptoService } from '@app/services/crypto.service';
import { UserService } from '@app/services/user.service';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = 'Chat';

  items: NbMenuItem[] = [];

  constructor(
    private crypt: CryptoService,
    private chat: ChatService,
    private userService: UserService) {

    userService.usuarios$.subscribe(users => {
      let _items: NbMenuItem[] = [];
      users.forEach((element: any) => {

        if (element.connected) {

          _items.push({
            title: element.username,
            link: `user/${element.userID}`
          });

        }
      });

      this.items = _items;
    });

    this.chat.userConnected().subscribe((user) => {
      this.chat.ping(user.userID);
      userService.addUsuario(user);
    });

  }

  ngOnInit(): void {
  }

}
