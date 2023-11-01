import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose/dist';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({
    required: true,
    index: true,
  })
  displayName: string;

  @Prop({
    required: true,
  })
  skinType: string;

  @Prop({
    required: true,
  })
  gender: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: true,
  })
  age: number;

  @Prop({
    default: 'no-posee-imagen',
  })
  img: string;

  @Prop({
    required: true,
  })
  rol: string;

  @Prop({
    default: true,
  })
  status: boolean;

  // * ejemplo e una relacion de muchos a muchos
  // * @Prop({ type: [{ type: Types.ObjectId, ref: Trainer.name }] })
  // * trainer: Types.Array<Trainer>;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.method('toJSON', function () {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __v, password, ...user } = this.toObject();

  //user.uid = _id;
  return user;
});
