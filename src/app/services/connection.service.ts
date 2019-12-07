import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConnectionService {

    constructor(private httpClient: HttpClient) { }

    updateUserConnectionMapper(connectionId: string): Observable<any> {
        return this.httpClient.post<any>(`api/Connections/UpdateUserConnectionMapper/${connectionId}`, null);
    }

    updateChessConnectionMapper(connectionId: string, chessId?: number){
        let params = $.param({
            connectionId: connectionId,
            chessId: chessId
        });
        return this.httpClient.post<any>(`api/connections/updateChessConnectionMapper?${params}`, null);
    }
}
