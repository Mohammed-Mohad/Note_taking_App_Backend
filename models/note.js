const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URL

mongoose.connect(url).then((result)=>{
    console.log();
}).catch((error)=>{
    console.log("error connecting to MongoDB:",error);
})

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

noteSchema.set('toJSON',{
    transform: (doc,ret)=>{
        ret.id = ret._id
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model('Note',noteSchema)
