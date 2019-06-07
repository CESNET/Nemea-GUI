export enum AlertType {
    Undecided = 0,
    Confirmed,
    FalsePositive,
    New
}
export function AlertTypeToString(type: AlertType): string {
    switch(type) {
        case AlertType.Undecided:
            return " ";
        case AlertType.Confirmed:
            return "Confirmed";
        case AlertType.FalsePositive:
            return "False positive";
        case AlertType.New:
            return "New";
        default:
            return "error";
    }
}
