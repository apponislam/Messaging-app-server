export interface IMessage {
    sender: string;
    receiver: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}
