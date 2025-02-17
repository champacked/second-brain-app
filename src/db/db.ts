import mongoose, { model, Schema, Types } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => {
    console.log(`MongoDB Connected: ${process.env.MONGO_URL}`);
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

// let isConnected = false; // Track connection status

// async function connectToDatabase() {
//   if (isConnected) return;

//   try {
//     // Connect to MongoDB without the deprecated options
//     await mongoose.connect(process.env.MONGO_URL!);
//     isConnected = true;
//     console.log(`MongoDB Connected: ${process.env.MONGO_URL}`);
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", (error as Error).message);
//   }
// }

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const contentTypes = ["image", "video", "article", "audio"] as const;
const ContentSchema = new Schema({
  link: {
    type: String,
    required: true,
  },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  tags: [
    {
      tagId: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
    },
  ],
  userId: { type: Types.ObjectId, ref: "Users", required: true },
  contentId: { type: String, required: true, unique: true },
  createdAt: { type: String },
});

const TagSchema = new Schema({
  title: {
    type: String,
    required: true,
    set: (a: string) => a.toLowerCase().trim(),
  },
  tagId: { type: String, required: true, unique: true },
});

const LinkSchema = new Schema({
  hash: { type: String, required: true },
  userId: { type: Types.ObjectId, ref: "Users", required: true },
});

export const UsersModel = model("Users", UserSchema);
export const ContentModel = model("Content", ContentSchema);
export const TagsModel = model("Tags", TagSchema);
export const LinksModel = model("Links", LinkSchema);
