import { Injectable } from '@angular/core';
import rsa from 'js-crypto-rsa';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;

  constructor() {

    if (!!localStorage.getItem("Key") === false) {
      rsa.generateKey(2048).then((key) => {
        localStorage.setItem("Key", JSON.stringify({
          publicKey: key.publicKey,
          privateKey: key.privateKey
        }));
      })
    }

    const keys = JSON.parse(localStorage.getItem("Key") || "");
    this.publicKey = keys.publicKey;
    this.privateKey = keys.privateKey;
  }

  async encrypt(msg: string, key : JsonWebKey): Promise<Uint8Array> {
    
    const uint8array = new TextEncoder().encode(msg);

    return await rsa.encrypt(uint8array, key, 'SHA-256');  
  }

  async decrypt(msg: Uint8Array): Promise<string> {

    const decrypted = await rsa.decrypt(msg,this.privateKey,'SHA-256',);

    return new TextDecoder().decode(decrypted);

  }

  verifyKeyUser(id: string) : boolean {
    if (!!localStorage.getItem(id))
      return true;     
    return false;  
  }

  addUserPublicKey(id : string, key : JsonWebKey) {
    localStorage.setItem(id, JSON.stringify({key}));
  }

  getUserPublicKey(id : string) : JsonWebKey {
    return JSON.parse(localStorage.getItem(id)!)?.key;
  }
  
}
