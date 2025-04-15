import { Schema, model } from 'mongoose';

interface IBlacklist {
  token: string;
  createdAt: Date;
}

const blacklistSchema = new Schema<IBlacklist>({
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: '1h' }, 
});

const Blacklist = model<IBlacklist>('Blacklist', blacklistSchema);

export default Blacklist;
