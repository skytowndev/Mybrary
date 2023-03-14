const express = require('express')
const author = require('../models/author')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')
const { route } = require('./books')



// All Authors Route
router.get('/', async (req,res)=> {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {
            authors: authors, 
            searchOptions:req.query.name 
        })
    } catch {
        res.redirect('/')
    }

    //res.send('Hello world.')
    
})


//New Author Route
router.get('/new', (req,res)=> {
    //res.send('Hello world.')
    res.render('authors/new', {author: new Author() })
})

//Create Author Route
router.post('/', async (req,res)=> {
    //res.send('Hello world.')
    const author = new Author({
        name: req.body.name
    })
    try {

        const newAuthor = await author.save()
        //res.redirect('authors')
        res.redirect(`authors/${newAuthor.id}`)

    } catch {
        res.render('authors/new',{
            author: author,
            errorMessage: 'Error creating Author'
        })
    }

    
    // author.save((err, newAuthor) => {
    //     if (err) {
    //         res.render('authors/new', {
    //             author: author,
    //             errorMesage: 'Error creating Author'
    //         })
    //     } else {
    //         //res.redirect(`authors/${newAuthor.id}`)
    //         res.redirect('/authors')
    //     }
    // })

    // author.save().then(() => {
    //     res.redirect('/authors')
    // }).catch((err) => {
    //     console.log(err)
    // })
    //res.send(req.body.name)
})


router.get('/:id', async (req, res) => {

    try {
        const author = await Author.findById(req.params.id)
        const booksByAuthor = await Book.find({author: author.id}).limit(6).exec()
        res.render('authors/show', {author: author, booksByAuthor:booksByAuthor })

    } catch {
        res.redirect('/')
    }



    res.render('authors/edit', {author: author })
})

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {author: author })
    } catch {
        res.redirect('/authors')
    }

    
})

router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)

    } catch {
        if (author == null) {
            res.redirect('/')
        } else {
            res.render('/authors/edit',{
                author: author,
                errorMessage: 'Error updating Author'
            })
        }
    }


})

router.delete('/:id', async (req, res) => {
    let query
    try {

        query = await Author.deleteOne({_id: req.params.id})
        //author = await Author.findById(req.params.id)
        //await author.remove()

        res.redirect('/authors')

        //res.send(query)

    } catch {
        //if (query == null) {
        //    res.redirect('/')
        //} else {
            res.redirect(`/authors/${req.params.id}`)
        //}
    }
})


module.exports = router