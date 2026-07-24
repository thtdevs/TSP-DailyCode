const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['text', 'image', 'code'], required: true },
    content: { type: String },  
    language: { type: String },  
    url: { type: String },      
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    blocks: [blockSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);