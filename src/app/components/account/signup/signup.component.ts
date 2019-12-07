import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterUser } from './register-user';
import { AccountService } from '../../../services/account.service';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'account-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['signup.component.css']
})
export class SignupComponent {
    registerUser: RegisterUser = new RegisterUser({});
    isLoading = false;
    constructor(private router: Router,
        private toastr: ToastrService,
        private authService: AuthService,
        private accountService: AccountService,
        private route: Router) { }

    registerUserSubmit() {
        this.isLoading = true;
        if (this.registerUser.confirmPassword !== this.registerUser.password) {
            this.toastr.error(`Password and Confirm password don't match`, 'Error');
            this.isLoading = false;
        }
        this.accountService.register(this.registerUser).take(1).subscribe(s => {
            this.isLoading = false;
            this.toastr.success('Check you email to active your account', 'Success');
            this.route.navigate(['account/signup-confirm']);
        }, error => {
            this.isLoading = false;
            this.toastr.error(error.error, 'Error');
        });
    }
}
