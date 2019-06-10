import { Observable, of } from 'rxjs';

export class HandleServiceError {
    static handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error('Failed on ' + operation + '. Error details:');
            console.error(error);
            return of(result as T);
        };
    }
}
