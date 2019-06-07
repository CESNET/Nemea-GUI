import { AlertType } from './alertType';

export class AlertSimple {
    date?: string;
    category?: string[];
    source?: string;
    target?: string[];
    flows?: number;
    status?: AlertType;
    id: string; // ID of full alert
}
