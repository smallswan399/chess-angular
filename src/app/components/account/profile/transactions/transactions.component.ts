import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../../services/account.service';
import { BaseAComponent } from '../../../base/baseA.component';
import { environment } from '../../../../../environments/environment.prod';

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent extends BaseAComponent implements OnInit {
    trans: any[];
    etherscan: string;
    constructor(private accountSerivce: AccountService) {
        super();
        if (!environment.production) {
            this.etherscan = "https://ropsten.etherscan.io/tx/";
        }else{
            this.etherscan = "https://etherscan.io/tx/";
        }
    }

    ngOnInit() {
        this.Identity$.take(1).subscribe(s => {
            if (s.isAuthenticated === true) {
                this.accountSerivce.getTransactions().take(1).subscribe(trans => { this.trans = trans });
            }
        });
    }

}
