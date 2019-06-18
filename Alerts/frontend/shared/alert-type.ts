export enum AlertType {
    Undecided = -1,
    Confirmed = 0,
    FalsePositive
}
export function AlertTypeToString(type: AlertType): string {
    switch(type) {
        case AlertType.Undecided:
            return " ";
        case AlertType.Confirmed:
            return "Confirmed";
        case AlertType.FalsePositive:
            return "False positive";
        default:
            return " ";
    }
}
