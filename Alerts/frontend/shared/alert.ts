import { Address } from './address';

export class Alert {
    detectTime: string;
    category: string[];
    target ?: Address[];
    flowCount: number;
    description?: string;
    format: string;
    source: Address;
    id: string;

    createTime: string;
}
