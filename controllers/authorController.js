const Author = require('../models/author');
const async = require('async');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');

exports.author_list = (req, res, err) => {
    Author.find()
        .sort([['family_name', 'ascending']])
        .exec((err, list_authors) => {
            if (err) { return next(err) }
            res.render('author_list', { title: 'Author List', author_list: list_authors })
        })
}

exports.author_detail = (req, res, next) => {
    async.parallel({
        author: callback => {
            Author.findById(req.params.id).exec(callback)
        },

        author_books: callback => {
            Book.find({ 'author': req.params.id }, 'title summary').exec(callback);
        }
    }, (err, results) => {
        if (err) { return next(err) }
        if (results.author == null) {
            const error = new Error('Author not found');
            error.code = 404;
            return next(error);
        }

        res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.author_books })
    })
}

exports.author_create_get = (req, res) => {
    res.render('author_form', { title: 'Create Author' });
}

exports.author_create_post = [
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified')
        .isAlphanumeric().withMessage('First name has no alpha numeric characters'),
    body('family_name').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified')
        .isAlphanumeric().withMessage('Family name has no alpha numeric characters'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array() })
            return;
        } else {
            const author = new Author({
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death
            });

            author.save(err => {
                if (err) { next(err) };
                res.redirect(author.url);
            })
        }
    }
]

exports.author_delete_get = (req, res) => res.send("NOT IMPLEMENTED : AUTHOR DELETED GET")

exports.author_delete_post = (req, res) => res.send("NOT IMPLEMENTED : AUTHOR DELETED Post")

exports.author_update_get = (req, res) => res.send("NOT IMPLEMENTED : AUTHOR updated GET")

exports.author_update_post = (req, res) => res.send("NOT IMPLEMENTED : AUTHOR updated Post")