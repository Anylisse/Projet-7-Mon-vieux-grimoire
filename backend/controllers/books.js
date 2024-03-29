const Book = require('../models/book');
const fs = require('fs');
const host = "mon-vieux-grimoire-backend-5py1.onrender.com";

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${host}/images/${req.file.filename.split('.')[0]}optimized.webp`,
        averageRating: bookObject.ratings[0].grade
    });

    book.save()
        .then(() => { res.status(201).json({ message: 'Livre enregistré !' }) })
        .catch((error) => { res.status(400).json({ error }) });
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${host}/images/${req.file.filename.split('.')[0]}optimized.webp`,
    } : { ...req.body };

    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: '403: unauthorized request' });
            } else if (req.file) {
                const filename = book.imageUrl.split('/images')[1];
                fs.unlink(`images/${filename}`, () => { });
            }
            Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                .then(res.status(200).json({ message: 'Livre modifié !' }))
                .catch((error) => res.status(401).json({ error }));
        })
        .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: '403: unauthorized request' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Livre supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                })
            }
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getBestRatingBook = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
};

exports.ratingBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            book.ratings.push({ userId: req.auth.userId, grade: req.body.rating });
            let ratingTotal = 0;
            for (i = 0; i < book.ratings.length; i++) {
                ratingTotal = ratingTotal + book.ratings[i].grade;
            }
            book.averageRating = ratingTotal / book.ratings.length;
            book.save();
            res.status(201).json(book)
        })
        .catch((error) => res.status(400).json({ error }));
};