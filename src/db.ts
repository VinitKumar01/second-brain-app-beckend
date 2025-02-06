import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    username: {type: String, unique: true, required: true}
})

const contentTypes = ["youtube", "twitter"];

const contentSchema = new Schema({
    link: {type: String, required: true},
    type: {type: String, enum:contentTypes, required: true},
    title: {type: String, required: true},
    tags: [{type: String, ref: "tag"}],
    contentSummary : {type: String, required: true},
    userId: {type: ObjectId, ref: "user", required: true,
        validate: async function(value:mongoose.Types.ObjectId) {
          const user = await UserModel.findById(value);
          if (!user) {
            throw new Error('User does not exist');
          }
        }}
})

const tagSchema = new Schema({
    title: {type: String, required: true, ref: "content",
        validate: async function(value:mongoose.Types.ObjectId) {
          const user = await UserModel.findById(value);
          if (!user) {
            throw new Error('User does not exist');
          }
        }}
})

const linkSchema = new Schema({
    hash: {type: String, required: true},
    userId: {type: ObjectId, ref: "user", required: true,
        validate: async function(value:mongoose.Types.ObjectId) {
          const user = await UserModel.findOne({
            _id: value
          });
          if (!user) {
            throw new Error('User does not exist');
          }
        }},
})

export const UserModel = mongoose.model("user", userSchema);
export const ContentModel = mongoose.model("content", contentSchema);
export const TagModel = mongoose.model("tag", tagSchema);
export const LinkModel = mongoose.model("link", linkSchema);