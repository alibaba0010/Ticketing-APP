import { Schema, model, Model, Document, Types } from "mongoose";
import { TicketDoc } from "../../../tickets/src/models/tickets.mongo";
interface OrderAttrs {
  status: string;
  price: number;
  userId: string;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderDoc extends Document {
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number;
  userId: string;
}

interface OrderModel extends Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const OrderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: Types,
    },
    ticket: {
      type: Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// OrderSchema.set('versionKey', 'version');
// OrderSchema.plugin(updateIfCurrentPlugin);

OrderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = model<OrderDoc, OrderModel>("Order", OrderSchema);
export { Order };
