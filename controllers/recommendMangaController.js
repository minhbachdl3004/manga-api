const Manga = require("../models/Manga");
const fs = require("fs");

//GET ALL MANGA
const getRecommendMangas = async (req, res) => {
  try {
    const mangas = await Manga.aggregate([
      {
        $addFields: {
          viewsNumeric: {
            $cond: {
              if: {
                $regexMatch: {
                  input: "$moreInfo.Views",
                  regex: /^\d+(,\d+)*$/,
                },
              },
              then: { $toInt: { $replaceAll: { input: "$moreInfo.Views", find: ",", replacement: "" } } },
              else: 0,
            },
          },
        },
      },
      {
        $sort: {
          viewsNumeric: -1,
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
          moreinfo: 1,
          totalChapter: 1,
          moreInfo: 1,
          views: "$moreInfo.Views",
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
