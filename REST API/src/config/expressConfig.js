const express = require('express');
const cors = require('cors');
const { auth } = require('../middlewares/authMiddlewares');


exports.expressConfig = (app) =>{
    app.use(express.urlencoded({extended:false}));
    app.use(express.json());
    app.use(cors());
    app.use(auth);
}