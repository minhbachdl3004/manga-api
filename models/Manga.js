const mongoose = require("mongoose")

const chapterSchema = new mongoose.Schema({
  chapterId: {
    type: String,
    require: true,
  },
  chapterName: {
    type: String,
    require: true,
  },
  images: {
    type: Array,
    require: true,
  },
});

const mangaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    otherName: {
      type: String,
    },
    mangaId: {
      type: Number,
      require: true,
      unique: true,
    },
    poster: {
      type: String,
      require: true,
      unique: true,
    },
    genres: {
      type: Array,
      require: true,
      default: [],
    },
    description: {
      type: String,
      require: true,
    },
    moreInfo: {
      type: {},
      require: true,
    },
    chapters: {
      type: [chapterSchema],
      require: true,
    },
    posterManga: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Manga", mangaSchema);
