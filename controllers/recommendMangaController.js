const Manga = require("../models/Manga");
const fs = require("fs");

//GET ALL MANGA
const getRecommendMangas = async (req, res) => {
  try {
    const mangas = await Manga.aggregate([
      {
        $addFields: {
          "moreInfo.ViewsNumeric": {
            $convert: {
              input: "$moreInfo.Views",
              to: "int",
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
      {
        $sort: { "moreInfo.ViewsNumeric": -1 },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          "moreInfo.ViewsNumeric": 0,
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
  getRecommendMangas,
};
