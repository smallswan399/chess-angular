import { BaseAComponent } from './components/base/baseA.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { WindowRef } from './services/window-ref.service';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AuthService } from './services/auth.service';
import { NgReduxModule, NgRedux, DevToolsExtension } from '@angular-redux/store';
import { IAppState, rootReducer, INITIAL_STATE } from './app.store';
import { createLogger } from 'redux-logger';
import { IdentityReduxStoreService } from './services/identity-redux-store.service';
import { BaseComponent } from './components/base/base.component';
import { LoginComponent } from './components/account/login/login.component';
import { SavarActions } from './app.actions';
import { TokenInterceptor } from './services/token.interceptor';
import { LogoutComponent } from './components/account/logout/logout.component';
import { ChessesComponent } from './components/chesses/chesses.component';
import { ChessService } from './services/chess.service';
import { ChessDetailsComponent } from './components/chesses/chess-details/chess-details.component';
import { SignalrConnectionService } from './services/signalr-connection.service';
import { APIInterceptor } from './services/api.interceptor';
import { ConnectionService } from './services/connection.service';
import { PlayerDetailsComponent } from './components/chesses/chess-details/player-details/player-details.component';
import { FormsModule } from '@angular/forms';
import { PlayerComponent } from './components/chesses/player/player.component';
import { ChessReduxStoreService } from './services/redux-store-services/chess-redux-store.service';
import { UserReduxStoreService } from './services/redux-store-services/user-redux-store.service';
import { ReduxContextService } from './services/redux-store-services/redux-context.service';
import { LoadingModule } from 'ngx-loading';
import { CountDownComponent } from './components/count-down/count-down.component';
import { CountdownModule } from 'ngx-countdown';
import { TimingPipe } from './pipes/timing.pipe';
import { GameResultEnumPipe } from './pipes/game-result-enum.pipe';
import { SilentRenewComponent } from './components/account/silent-renew/silent-renew.component';
import { SignupComponent } from './components/account/signup/signup.component';
import { ChessListItemComponent } from './components/chesses/chess-list-item/chess-list-item.component';
import { ChatComponent } from './components/controls/chat/chat.component';
import { MessageService } from './services/message.service';
import { MessageReduxStoreService } from './services/redux-store-services/message-redux-store.service';
import { ChatListItemComponent } from './components/controls/chat/chat-list-item/chat-list-item.component';
import { CustomScrollBarDirective } from './components/controls/custom-scroll-bar.directive';
import { OnCreateDirective } from './components/controls/on-create.directive';
import { AccountService } from './services/account.service';
import { ProfileComponent } from './components/account/profile/profile.component';
import { StatisticComponent } from './components/account/profile/statistic/statistic.component';
import { TransactionsComponent } from './components/account/profile/transactions/transactions.component';
import { EthereumAccountComponent } from './components/account/profile/ethereum-account/ethereum-account.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SignupConfirmComponent } from './components/account/signup-confirm/signup-confirm.component';
import { LaddaModule } from 'angular2-ladda';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        HeaderComponent,
        BaseComponent,
        LoginComponent,
        LogoutComponent,
        ChessesComponent,
        ChessDetailsComponent,
        PlayerDetailsComponent,
        PlayerComponent,
        CountDownComponent,
        SilentRenewComponent,
        SignupComponent,
        TimingPipe,
        GameResultEnumPipe,
        ChessListItemComponent,
        ChatComponent,
        ChatListItemComponent,
        CustomScrollBarDirective,
        OnCreateDirective,
        ProfileComponent,
        StatisticComponent,
        TransactionsComponent,
        EthereumAccountComponent,
        SignupConfirmComponent,
        BaseAComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        NgReduxModule,
        LoadingModule,
        CountdownModule,
        ModalModule.forRoot(),
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        LaddaModule
    ],
    providers: [
        WindowRef,
        ChessService,
        MessageService,
        AccountService,
        AuthService,
        SignalrConnectionService,
        ConnectionService,
        ChessReduxStoreService,
        UserReduxStoreService,
        MessageReduxStoreService,
        ReduxContextService,
        IdentityReduxStoreService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: APIInterceptor,
            multi: true,
        },
        SavarActions],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(ngRedux: NgRedux<IAppState>, private devTools: DevToolsExtension) {
        let enhancers = [];
        // You probably only want to expose this tool in devMode.
        if (devTools.isEnabled()) {
            enhancers = [...enhancers, devTools.enhancer()];
        }
        ngRedux.configureStore(rootReducer, INITIAL_STATE, [createLogger()], enhancers);
    }
}
