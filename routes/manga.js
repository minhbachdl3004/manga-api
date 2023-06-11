const mangaController = require("../controllers/mangaController");
const multer = require('multer');



const router = require("express").Router();

//GET ALL MANGAS
router.get("/get-all", mangaController.getAllMangas);

// Configure multer for handling file uploads
const upload = multer({ dest: 'uploads/' });
//ADD MANGA
router.post("/add", upload.single('file'), mangaController.addManga);

//GET MANGAS BY NAME
router.get("/name/:name", mangaController.searchMangaByName);

//SEARCH MANGA BY NAME AND CHAPTER
router.get("/search", mangaController.getMangaByIdAndChapter);


//GET MANGAS BY GENRE
router.get("/genre/:genre", mangaController.searchMangaByGenre);

module.exports = router;