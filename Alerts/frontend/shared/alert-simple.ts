import { AlertType } from './alert-type';

export class AlertSimple {
    DetectTime?: string;
    Category?: string[];
    Source?: string[];
    Target?: string[];
    FlowCount?: number;
    Status?: AlertType;
    ID: string; // ID of full alert
    New?: boolean;
}
