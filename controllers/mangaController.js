const Manga = require("../models/Manga");
const fs = require("fs");

//ADD MANGA DATA
const addManga = async (req, res) => {
  try {
    const jsonData = fs.readFileSync(req.file.path, "utf8");
    const data = JSON.parse(jsonData);
    let message = ""
    const totalMangas = await Manga.countDocuments();
    let i = 1;
    for (const item of data) {
      item.mangaId = totalMangas + i;
      item.totalChapter = item.chapters.length;
      try {
        const existingManga = await Manga.findOne({ name: item.name });
        if (existingManga) {
          existingManga.otherName = item.otherName;
          existingManga.poster = item.poster;
          existingManga.genres = item.genres;
          existingManga.description = item.description;
          existingManga.moreInfo = item.moreInfo;
          existingManga.chapters = item.chapters;
          existingManga.mangaPoster = item.mangaPoster;
          existingManga.totalChapter = item.totalChapter;
          await existingManga.save();
          message = "Update manga successfully"
        } else {
          await Manga.create(item);
          message = "Add manga successfully"
        }
        i++;
      } catch (error) {
        console.error("Error updating manga:", error);
      }
    }
    // Delete the uploaded file
    fs.unlinkSync(req.file.path);
    
    return res
      .status(200)
      .json({ message: message, count: data.length });
  } catch (error) {
    console.error("Error updating data:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating data" });
  }
};

//GET ALL MANGA
const getAllMangas = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;

    // Get the total number of messages
    const totalMangas = await Manga.countDocuments();

    const mangas = await Manga.find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    if (mangas.length === 0) {
      res.status(404).json("Not found Manga");
      return;
    }
    res.status(200).json({
      mangas,
      pagination: {
        page,
        perPage,
        totalPages: Math.ceil(totalMangas / perPage),
        totalMangas,
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

//SEARCH MANGA BY NAME
const searchMangaByName = async (req, res) => {
  try {
    const { name } = req.query;
    console.log(name);

    const page = parseInt(req.query.page) || 1;
    const perPage = 10;
    const totalMangas = await Manga.countDocuments({
      name: { $regex: new RegExp(name, "i") },
    });

    const mangas = await Manga.find({
      name: { $regex: new RegExp(name, "i") },
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    console.log(mangas);

    if (mangas.length === 0) {
      res.status(404).json("Not found Manga");
      return;
    }
    res.status(200).json({
      mangas,
      pagination: {
        page,
        perPage,
        totalPages: Math.ceil(totalMangas / perPage),
        totalMangas,
      },
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getMangaById = async (req, res) => {
  try {
    const { mangaId } = req.params;
    console.log(mangaId);

    const manga = await Manga.findOne({
      mangaId: mangaId,
    });

    if (manga.length === 0) {
      res.status(404).json("Not found Manga");
      return;
    }
    res.status(200).json({ manga });
  } catch (error) {
    res.status(500).json(error);
  }
};

//GET MANGA BY NAME AND ITS CHAPTER
const getChapterByChapterId = async (req, res) => {
  try {
    const { mangaId, chapterId } = req.query;
    console.log(chapterId);

    const manga = await Manga.findOne({ mangaId: mangaId });
    console.log(manga);

    if (!manga) {
      res.status(404).json("Not found Manga");
      return;
    }

    res.status(200).json({ manga });
  } catch (error) {
    res.status(500).json(error);
  }
};

//SEARCH MANGA BY GENRE
const searchMangaByGenre = async (req, res) => {
  try {
    const { genre } = req.params;

    const page = parseInt(req.query.page) || 1;
    const perPage = 10;

    const totalMangas = await Manga.countDocuments({
      genres: { $regex: new RegExp("^" + genre, "i") },
    }).exec();

    const mangas = await Manga.find({
      genres: { $regex: new RegExp("^" + genre, "i") },
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    if (mangas.length === 0) {
      res.status(404).json("Not found Manga");
      return;
    }

    res.status(200).json({
      mangas,
      pagination: {
        page,
        perPage,
        totalPages: Math.ceil(totalMangas / perPage),
        totalMangas,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
//GET MANGA FOR POSTER MANGA
const getMangaForPoster = async (req, res) => {
  try {
    const mangas = await Manga.find({ posterManga: 1 });
    console.log(mangas);

    if (!mangas) {
      res.status(404).json("Not found Manga");
      return;
    }

    res.status(200).json({ mangas });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  addManga,
  getAllMangas,
  getMangaById,
  searchMangaByName,
  getMangaForPoster,
  searchMangaByGenre,
  getChapterByChapterId,
};
