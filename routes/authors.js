const express = require('express')
const router = express.Router()
const Author = require('../models/author')



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
        res.redirect('authors')

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

module.exports = router