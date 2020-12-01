require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const POKEDEX = require('./pokedex.json')



const app = express()
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]

function handleGetTypes(req, res) {

    res.json(validTypes)
}
function handleGetPokemon(req, res) {
    const {name = '', type = ''} = req.query

    if (!type && !name){
        res.status(400).send('Please request a type or name')
    }
    if (!validTypes.includes(type)){
        
        return res.status(400).send('Please request a valid type')
    }
    if (name){
        const filteredByName = POKEDEX.pokemon
        .filter(poke=>{
            return poke.name.toLowerCase().includes(name.toLowerCase())
        })
        if (type && filteredByName){
            filteredByName.filter(poke => {
                return poke.type.includes(type)
            })
        }
        return res.json(filteredByName)

    }
    if (type){
        const filtered = POKEDEX.pokemon
                            .filter(poke =>{
                                return poke.type.includes(type)
                            })
        res.json(filtered)
    }

}
app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN
    

    if (!authToken || authToken.split(' ')[1]!==apiToken){
        return res.status(401).json({error: 'Unauthorized request'})
    }
    // move to the next middleware

    next()
})

// GET /types
app.get('/types', handleGetTypes)

// GET /pokemon
app.get('/pokemon', handleGetPokemon)


app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
  })

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    
})


