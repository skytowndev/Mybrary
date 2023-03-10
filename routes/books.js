const express = require('express')
const router = express.Router()
//const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Book = require('../models/book')
const Author = require('../models/author')
const uploadPath = path.join('public',Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg','image/png','image/gif']
//const upload = multer({
//   dest: uploadPath,
//    fileFilter: (req, file, callback) => {
//        callback(null,imageMimeTypes.includes(file.mimetype))
//    }
//
//})


// All Book Route
router.get('/', async (req,res)=> {

    let query = Book.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }

    try{
        //const books = await Book.find({ })
        const books = await query.exec()

        res.render('books/index',{
            books:books,
            searchOptions: req.query
        })

    } catch {
        res.redirect('/')
    }


    //res.send('All Books')
    
})


//New Book Route
router.get('/new', async (req,res)=> {
    renderNewPage(res, new Book ())

    //res.send('New Book')
})

//Create Book Route
//router.post('/', upload.single('cover'), async (req,res)=> {
router.post('/', async (req,res)=> {
    //const filename = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        //coverImageName: filename,
        description: req.body.description

    })
    saveCover(book, req.body.cover)

    try{
        const newBook = await book.save()
        //res.redirect(`books/${newBook.id}`)
        res.redirect('books')
    } catch {
        // if (book.coverImageName !== null) {
        //     removeBookCover(book.coverImageName)
        // }
        renderNewPage(res, book, true)
    }

   //res.send('Create Book')

})

// function removeBookCover(fileName) {

//     fs.unlink(path.join(uploadPath, fileName), err=> {
//         if (err) console.error(err)
//     })

// }


async function renderNewPage(res, book, hasError = false){

    try {
        const author = await Author.find({})
        //const book = new Book()
        const params = {
            authors: author,
            book: book
        }
        if (hasError){
            params.errorMessage = 'Error Creating Book'
        }

        res.render('books/new',params)

   } catch {
        res.redirect('/books')

   }


}


function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data,'base64')
        book.coverImageType = cover.type
    }
}

module.exports = router