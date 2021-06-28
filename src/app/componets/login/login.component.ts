import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ChatService } from '@app/services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm !: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private chatService: ChatService,
    private router: Router) {
    console.log('aqui2');
    const sessionID = localStorage.getItem("sessionID");
    if (!!sessionID)
      this.router.navigate(['/home']);

  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      nome: ['', Validators.required],
    });
  }

  onSubmit(): void {    
    this.chatService.setUsername(this.loginForm.value.nome);
    
    setTimeout(() => window.location.reload(), 2000);
  }

}
