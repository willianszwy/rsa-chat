import { Injectable } from '@angular/core';
import { Usuario } from '@app/models/usuario';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChatService } from './chat.service';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly _usuarios = new BehaviorSubject<Usuario[]>([]);

  readonly usuarios$ = this._usuarios.asObservable();

  constructor() { }

  getUsuarios(): Usuario[] {
    return this._usuarios.getValue();
  }

  private _setUsuarios(usuarios: Usuario[]): void {
    this._usuarios.next(usuarios);
  }

  updateStatus(id : string, status: boolean): void {
    const usuarios = this.getUsuarios();
    usuarios[usuarios.findIndex(u => u.userID === id)].connected = status;
    this._setUsuarios(usuarios);
  }

  find(id: string): Observable<Usuario> {
    return this._usuarios.pipe(
      map((usuarios : Usuario[] ) => usuarios.find(u => u.userID === id)!)
      );
  }

  addUsuario(usuario: Usuario): void {
    const _usuario = this.getUsuarios().find(u => u.userID === usuario.userID);    
    if (!!_usuario){
      this.updateStatus(usuario.userID,true);
      return;
    }
      

    this._setUsuarios([...this.getUsuarios(), usuario]);
  }

  removeUsuario(usuario: Usuario): void {
    const usuarios = this.getUsuarios().filter(u => u.userID !== usuario.userID);
    this._setUsuarios(usuarios);
  }
}
