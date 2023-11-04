import mongoose  from 'mongoose';

const URLSchema = new  mongoose.Schema({

    shortId:{
        type:String
    },
    url:{
        type:String
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
      }
});


const URLModel = mongoose.model('URL',URLSchema);

export default URLModel;
