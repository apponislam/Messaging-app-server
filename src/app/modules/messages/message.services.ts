import { IMessage } from "./message.interface";
import { MessageModel } from "./message.model";

const createMessage = async (data: IMessage) => {
    return await MessageModel.create(data);
};

const getMessagesBetweenUsers = async (userA: string, userB: string) => {
    return await MessageModel.find({
        $or: [
            { sender: userA, receiver: userB },
            { sender: userB, receiver: userA },
        ],
    })
        .sort({ createdAt: 1 })
        .populate("sender", "_id name email username avatarUrl")
        .populate("receiver", "_id name email username avatarUrl");
};

export const messageServices = {
    createMessage,
    getMessagesBetweenUsers,
};
