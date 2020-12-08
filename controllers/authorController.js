const Author = require('../models/author');
const async = require('async');
const Book = require('../models/book');

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

exports.author_create_get = (req, res) => res.send("NOT IMPLEMENTED : AUTHOR CREATE GET")

exports.author_create_post = (req, res) => res.send("NOT IMPLEMENTED : AUTHOR CREATE POST")

exports.author_delete_get = (req, res) => res.send("NOT IMPLEMENTED : AUTHOR DELETED GET")

exports.author_delete_post = (req, res) => res.send("NOT IMPLEMENTED : AUTHOR DELETED Post")

exports.author_update_get = (req, res) => res.send("NOT IMPLEMENTED : AUTHOR updated GET")

exports.author_update_post = (req, res) => res.send("NOT IMPLEMENTED : AUTHOR updated Post")