import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from '../components/account/login/login.component';
import { LogoutComponent } from '../components/account/logout/logout.component';
import { ChessesComponent } from '../components/chesses/chesses.component';
import { ChessDetailsComponent } from '../components/chesses/chess-details/chess-details.component';
import { SilentRenewComponent } from '../components/account/silent-renew/silent-renew.component';
import { SignupComponent } from '../components/account/signup/signup.component';
import { ProfileComponent } from '../components/account/profile/profile.component';
import { StatisticComponent } from '../components/account/profile/statistic/statistic.component';
import { TransactionsComponent } from '../components/account/profile/transactions/transactions.component';
import { EthereumAccountComponent } from '../components/account/profile/ethereum-account/ethereum-account.component';
import { SignupConfirmComponent } from '../components/account/signup-confirm/signup-confirm.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'chesses', component: ChessesComponent },
    { path: 'chesses/details/:id', component: ChessDetailsComponent },
    {
        path: 'account', component: ProfileComponent, children: [
            {
                path: '', component: StatisticComponent
            },
            {
                path: 'ethereum-account', component: EthereumAccountComponent
            },
            {
                path: 'transactions', component: TransactionsComponent
            }
        ]
    },
    { path: 'account/login', component: LoginComponent },
    { path: 'account/logout', component: LogoutComponent },
    { path: 'account/silent-renew', component: SilentRenewComponent },
    { path: 'account/signup', component: SignupComponent },
    { path: 'account/signup-confirm', component: SignupConfirmComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
