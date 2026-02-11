import mongoose, { Schema, Document } from 'mongoose';

export interface NotificationDocument extends Document {
    user: mongoose.Types.ObjectId;
    type: "budget_warning" | 'reminder' | 'info' | 'budget_category_warning';
    message: string;
    isRead: boolean;
    createdAt: Date; 
}

const NotificationSchema = new Schema<NotificationDocument> (
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        type: { type: String, enum:['budget_warning', 'reminder', 'info', 'budget_category_warning'], default: 'info'},
        message: { type: String, required: true},
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model<NotificationDocument>('Notification', NotificationSchema);