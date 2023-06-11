const Manga = require("../models/Manga");
const fs = require("fs");

//ADD MANGA DATA
const addManga = async (req, res) => {
  try {
    const jsonData = fs.readFileSync(req.file.path, "utf8");
    const data = JSON.parse(jsonData);
    const totalMangas = await Manga.countDocuments();
    let i = 1;
    for (const item of data) {
      item.mangaId = totalMangas + i;
      try {
        const existingManga = await Manga.findOne({ name: item.name });
        if (existingManga) {
          existingManga.otherName = item.otherName;
          existingManga.poster = item.poster;
          existingManga.genres = item.genres;
          existingManga.description = item.description;
          existingManga.moreInfo = item.moreInfo;
          existingManga.chapters = item.chapters;
        } else {
          await Manga.create(item);
        }
        i++;
      } catch (error) {
        console.error("Error updating manga:", error);
      }
    }
    // Delete the uploaded file
    fs.unlinkSync(req.file.path);

    console.log("Data updated successfully");
    return res
      .status(200)
      .json({ message: "Data updated successfully", count: data.length });
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
    const { name } = req.params;
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

//GET MANGA BY NAME AND ITS CHAPTER
const getMangaByIdAndChapter = async (req, res) => {
  try {
    const { mangaId, chapterId } = req.query;
    console.log(mangaId, chapterId);

    const manga = await Manga.findOne({ mangaId: mangaId });
    console.log(manga);

    if (!manga) {
      res.status(404).json("Not found Manga");
      return;
    }

    const chapter = manga.chapters.find((chap) => chap.chapterId.includes(chapterId));
    if (!chapter) {
      res.status(404).json("Not found Chapter");
      return;
    }
    manga.chapters = [chapter]

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
      genres: { $in: genre },
    }).exec();

    const mangas = await Manga.find({
      genres: { $in: genre },
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
    res.status(500).json(error);
  }
};

module.exports = {
  addManga,
  getAllMangas,
  searchMangaByName,
  searchMangaByGenre,
  getMangaByIdAndChapter,
};
