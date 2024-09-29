const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//app.use(express.static(path.join(__dirname,'client/build')));

app.use('/api',authRoutes);   //imbed /api before each route 
app.use('/api/todo',todoRoutes);

mongoose.connect(process.env.DB_URL).then(
    () => console.log("DB connected successfuly !")
).catch(err=>console.log(err)
);

app.listen(PORT,() => console.log(`Server is running on ${PORT}`)
);

/*mongoose.connect(process.env.DB_URL); : automatically create a DB in compass with name mentioned in URL
but we can't see this DB in compass unless we have created any collection in it*/