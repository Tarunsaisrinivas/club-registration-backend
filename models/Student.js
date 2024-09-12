const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true, uppercase: true },
    year: { type: String, enum: ['I', 'II', 'III', 'IV'], required: true },
    branch: { type: String, required: true, uppercase: true },
    regno: { type: String, required: true },
    collegeName: { type: String, required: true }, 
    gender: { type: String, enum: ['M', 'F'], required: true },
    teamName: { type: String, required: true },
    mobileNo: { type: String, required: true, length: 10 },
    email: { type: String, required: true },
    payment: { type: String, required: true },
    transactionId: {type:String, required: true},
    tshirt: { type: String, required: true, }, 
    teamregno: { type: String, required: true, uppercase: true }, 
    
});

module.exports = mongoose.model('Student', StudentSchema);
