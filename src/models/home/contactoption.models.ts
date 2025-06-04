// models/ContactOption.ts
import { Schema, model, Document } from 'mongoose';

export interface IContactOption extends Document {
    whatsapp: string;
    email: string;
    telegram: string;
    phone: string;
}

const ContactOptionSchema = new Schema<IContactOption>({
    whatsapp: { type: String, required: true },
    email: { type: String, required: true },
    telegram: { type: String, required: true },
    phone: { type: String, required: true },
});

export const ContactOption = model<IContactOption>('ContactOption', ContactOptionSchema);
