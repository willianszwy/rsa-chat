import { Injectable } from '@angular/core';
import { Message } from '@app/models/message';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MsgService {

  private readonly _msgs = new BehaviorSubject<Map<string,Message[]>>(new Map());

  readonly msgs$ = this._msgs.asObservable();

  constructor() { }


  getMessages(id : string): Observable<Message[]> {
    return this._msgs
      .pipe(
        map((msgs ) => msgs.get(id)!)
      );
  }

  addMessage(id: string, msg : Message): void {
    const msgs = this._msgs.getValue();

    const user_msgs = msgs.get(id) || [];

    user_msgs.push(msg);

    msgs.set(id,user_msgs!);

    this._msgs.next(msgs);
  }

}
