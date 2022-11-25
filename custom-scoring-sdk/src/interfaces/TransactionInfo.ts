import Team from "../models/Team";

export default interface TransactionInfo {
    team: Team
    score: number
    timestamp: number
}