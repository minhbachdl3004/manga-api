const mangaController = require("../controllers/mangaController");
const recommendMangaController = require("../controllers/recommendMangaController")
const trendingMangaController = require("../controllers/trendingMangaController")
const multer = require('multer');

const router = require("express").Router();

//GET ALL MANGAS
router.get("/get-all", mangaController.getAllMangas);

//GET MANGA BY MANGAID
router.get("/mangaId/:mangaId", mangaController.getMangaById)

// Configure multer for handling file uploads
const upload = multer({ dest: 'uploads/' });
//ADD MANGA
router.post("/add", upload.single('file'), mangaController.addManga);

//GET MANGAS BY NAME
router.get("/name/search", mangaController.searchMangaByName);

//SEARCH MANGA BY NAME AND CHAPTER
router.get("/search", mangaController.getChapterByChapterId);

//GET MANGAS BY GENRE
router.get("/genre/:genre", mangaController.searchMangaByGenre);

//GET MANGAS FOR POSTER
router.get("/poster-manga", mangaController.getMangaForPoster)

//GET RECOMMEND MANGAS
router.get('/recommended-manga', recommendMangaController.getRecommendMangas)

//GET TRENDING MANGAS
router.get('/trending-manga', trendingMangaController.getTrendingMangas)

module.exports = router;