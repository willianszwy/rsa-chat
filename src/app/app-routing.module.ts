import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ChatComponent } from './componets/chat/chat.component';
import { HomeComponent } from './componets/home/home.component';
import { LoginComponent } from './componets/login/login.component';
import { AuthGuard } from './helpers/auth.guard';

const routes: Routes = [
  { path: 'login', component : LoginComponent},  
  { path: '', component : HomeComponent, canActivate: [AuthGuard],
    children: [
      { path: 'user/:id', component: ChatComponent, canActivate: [AuthGuard]},
    ]
  },

  //redireciona para o / se nao encontrar a rota
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
