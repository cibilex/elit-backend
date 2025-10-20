import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserTypes } from 'src/user.types';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, index: true, unique: true })
  username: string;

  @Prop({ required: true, index: true })
  password: string;

  @Prop({ required: true, index: true })
  permissions: number;

  @Prop({ enum: UserTypes, index: true })
  userType: UserTypes;

  @Prop({ required: true, default: false })
  isDeleted: boolean;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({
  username: 1,
  password: 1,
});
