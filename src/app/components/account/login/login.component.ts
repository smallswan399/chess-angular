import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    constructor(private authSerivce: AuthService, private router: Router) {}

    async ngOnInit() {
        let resull = await this.authSerivce.completeLogin();
        this.router.navigate(['/']);
    }

}
