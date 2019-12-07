import { Component, OnInit, Input } from '@angular/core';
import { Chess } from '../../../entities/chess';
import { BaseAComponent } from '../../base/baseA.component';
import { ChessService } from '../../../services/chess.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-chess-list-item, [app-chess-list-item]',
    templateUrl: './chess-list-item.component.html',
    styleUrls: ['./chess-list-item.component.css']
})
export class ChessListItemComponent extends BaseAComponent implements OnInit {
    @Input() game: Chess;
    notPlayer: boolean = true;
    constructor(private chessService: ChessService,
        private router: Router) {
        super();
    }

    ngOnInit() {
        this.Identity$.take(1).subscribe(s => this.notPlayer = !this.game.isPlayer(s.id));
    }

    join(id: number) {
        this.chessService.join(id, null).take(1).subscribe(s => {
            this.router.navigate(['/chesses/details', id]);
        });
    }

}
