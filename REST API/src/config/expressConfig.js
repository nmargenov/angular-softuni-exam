const express = require('express');
const cors = require('cors');

exports.expressConfig = (app) =>{
    app.use(express.urlencoded({extended:false}));
    app.use(express.json());
    app.use(cors());
}