import { Schema, model, Model, Document } from "mongoose";
import { PasswordMgt } from "../services/hashPassword";

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends Document {
  email: string;
  password: string;
  //   Add extra properties that a userdoc can display from mongo
}
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next(); //{}
  const hashed = await PasswordMgt.hashPassword(this.get("password"));
  this.set("password", hashed);
});
UserSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};
const User = model<UserDoc, UserModel>("User", UserSchema);
export { User };
