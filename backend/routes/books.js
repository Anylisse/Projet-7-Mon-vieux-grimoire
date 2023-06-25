const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const optimizedImg = require('../middleware/sharp-config');

const booksCtrl = require('../controllers/books');

router.get('/', booksCtrl.getAllBooks);
router.get('/bestrating', booksCtrl.getBestRatingBook);
router.get('/:id', booksCtrl.getOneBook);
router.post('/:id/rating', auth, booksCtrl.ratingBook);
router.post('/', auth, multer, optimizedImg, booksCtrl.createBook);
router.put('/:id', auth, multer, optimizedImg, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router;