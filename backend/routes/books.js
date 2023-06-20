const express = require('express');
const router = express.Router();

const booksCtrl = require('../controllers/books');

router.get('/', booksCtrl.getAllBooks);
router.get('/bestrating', booksCtrl.getBestRatingBook);
router.get('/:id', booksCtrl.getOneBook);
router.post('/:id/rating', booksCtrl.ratingBook);
router.post('/', booksCtrl.createBook);
router.put('/:id', booksCtrl.modifyBook);
router.delete(':id', booksCtrl.deleteBook);

module.exports = router;