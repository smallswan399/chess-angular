import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseAComponent } from '../../base/baseA.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { StatisticComponent } from './statistic/statistic.component';
import { EthereumAccountComponent } from './ethereum-account/ethereum-account.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    activeComponent: string;
    constructor() { }

    ngOnInit() {
    }

    onActivate($event){
        if ($event instanceof StatisticComponent) {
            this.activeComponent = "StatisticComponent";
        }
        if ($event instanceof TransactionsComponent) {
            this.activeComponent = "TransactionsComponent";
        }
        if ($event instanceof EthereumAccountComponent) {
            this.activeComponent = "EthereumAccountComponent";
        }
    }

    onDeactivate($event){
    }

}
