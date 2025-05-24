const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: function(v) {
        // Matches two or three digits, dash, then at least one digit
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number! Format must be XX-XXXXXXX or XXX-XXXXXXX`
    },
    required: [true, 'User phone number required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
  }
})

module.exports = mongoose.model('Person', personSchema)