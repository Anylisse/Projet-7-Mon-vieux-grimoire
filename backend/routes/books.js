const express = require('express');
const router = express.Router();

router.get('/', booksCtrl.getAllBooks);
router.get('/bestrating', booksCtrl.getBestRatingBook);
router.get('/:id', booksCtrl.getOneBook);
router.post('/', booksCtrl.createBook);
router.post('/:id/rating', booksCtrl.ratingBook);
router.put('/:id', booksCtrl.modifyBook);
router.delete(':id', booksCtrl.deleteBook);

module.exports = router;