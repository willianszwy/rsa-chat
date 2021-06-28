import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NbCardModule, NbInputModule, NbThemeModule } from '@nebular/theme';
import { NbSidebarModule, NbLayoutModule, NbButtonModule, NbChatModule, NbMenuModule } from '@nebular/theme';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '@env/environment';
import { ChatComponent } from './componets/chat/chat.component';
import { LoginComponent } from './componets/login/login.component';
import { HomeComponent } from './componets/home/home.component';


const sessionID = localStorage.getItem("sessionID");

const auth = sessionID ? { sessionID }  : "";

const config: SocketIoConfig = {
  url: environment.apiUrl, options: {
   auth
  }
};

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NbThemeModule.forRoot(),
    NbLayoutModule,
    NbSidebarModule.forRoot(),
    NbButtonModule,
    NbChatModule.forRoot(),
    SocketIoModule.forRoot(config),
    NbMenuModule.forRoot(),
    NbCardModule,
    NbInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
