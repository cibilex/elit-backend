import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserTypes } from 'src/user.types';
import { genSalt, hash } from 'bcrypt';
const SALT_WORK_FACTOR =
  (process.env.SALT_WORK_FACTOR && +process.env.SALT_WORK_FACTOR) || 10;
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, index: true })
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

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.index(
  {
    username: 1,
    isDeleted: 1,
  },
  { unique: true },
);

UserSchema.index({
  username: 1,
  userType: 1,
});
