import { Component, OnInit } from '@angular/core';
import { Login } from '../services/models/login';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CustomService } from '../services/custom.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm = new Login();
  public loginError: string;
  public isLoadPanelVisible: boolean;

  constructor(
    private apiService: ApiService,
    private customService: CustomService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.loginError = '';
    this.isLoadPanelVisible = false;
  }

  // ====================== function login =========================
  login() {
    this.isLoadPanelVisible = true;
    const resultCheck = this.customService.checkLogin(this.loginForm);
    if (resultCheck.status === 1) {
      this.loginError = resultCheck.message;
      this.isLoadPanelVisible = false;
      return;
    }
    this.apiService.login({
      Username: this.loginForm.Username,
      Password: this.loginForm.Password
    }).subscribe(
      response => {
        if (response && response.status === 200) {
          sessionStorage.setItem('auth-session', response['auth-session']);
          sessionStorage.setItem('timezone-browser', this.customService.getTimeZoneBrowser());
          this.isLoadPanelVisible = false;
          this.router.navigate(['/receipt']);
        }
      }, error => {
        switch (error.status) {
          case 401:
            this.loginError = 'Username or Password incorrect';
            break;
          case 404:
            this.loginError = 'This page is not found';
            break;
          case 500:
            this.loginError = 'Login failures';
            break;
        }
        this.isLoadPanelVisible = false;
      }
    );
  }
}
