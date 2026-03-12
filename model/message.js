
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    }

},{timestamps: true});

messageSchema.statics.sendNewMessage = async function(data) {
    const Message = this;
    const newMessage = new Message({
        sender: data.senderId,
        receiver: data.receiverId,
        content: data.content
    });
    return await newMessage.save();
};

// Mesaj Geçmişini Getirmemiz
messageSchema.statics.getChatHistory = async function(myId, userId) {
    return await this.find({
        $or: [
            { sender: myId, receiver: userId },
            { sender: userId, receiver: myId }
        ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'username')
    .populate('receiver', 'username');
};

module.exports = mongoose.model('Message', messageSchema);