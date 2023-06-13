const Manga = require("../models/Manga");
const fs = require("fs");

//GET ALL MANGA
const getTrendingMangas = async (req, res) => {
  try {
    const mangas = await Manga.aggregate([
      {
        $redact: {
          $cond: {
            if: { $ne: ["$moreInfo.Score", "N/A"] },
            then: "$$KEEP",
            else: "$$PRUNE",
          },
        },
      },
      {
        $match: {
          "moreInfo.Score": { $ne: "N/A" },
        },
      },
      {
        $addFields: {
          scoreNumeric: {
            $toDouble: "$moreInfo.Score",
          },
        },
      },
      {
        $sort: {
          scoreNumeric: -1,
        },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 1,
          name: 1,
          poster: 1,
          genres: 1,
          moreInfo: 1,
          totalChapter: 1,
          score: "$moreInfo.Score",
        },
      },
    ]);

    if (mangas.length === 0) {
      res.status(404).json("Not found Manga");
      return;
    }
    res.status(200).json({ mangas });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getTrendingMangas,
};
