const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  chapterId: {
    type: Number,
    require: true,
  },
  images: {
    type: Array,
    require: true,
  },
});

const mangaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      unique: true,
    },
    mangaId: {
      type: Number,
      require: true,
      unique: true,
    },
    thumbnail: {
      type: String,
      require: true,
      unique: true,
    },
    genres: {
      type: Array,
      require: true,
      default: [],
    },
    author: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    chapters: {
      type: [chapterSchema],
      require: true,
    },
    totalChapters: {
      type: Number,
      require: true,
    },
    status: {
      type: Number,
      default: 1,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Manga", mangaSchema);
