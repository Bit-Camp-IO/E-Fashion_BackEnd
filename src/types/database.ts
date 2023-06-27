import mongoose from 'mongoose';

export type Relation<T> = mongoose.PopulatedDoc<mongoose.Document<mongoose.ObjectId> & T>;
export type RelationList<T> = Relation<T>[];
