//const express = require ("express");
//const oProductManager = require("./ProductManager");
import express from 'express';
import oProductManager from './ProductManager.js';

const getAllProducts = async () => {
    let oProducts = await oProductManager.getProducts();
    console.log(oProducts);
    return oProducts;
}

const app = express();

app.get("/ping", (req, res) => {
    res.send("pong");
});

app.get("/products", (req, res) => {
    console.log("Mostrando productos: ");
    res.send(getAllProducts());
});

app.listen(3000, () => {
    console.log("App funcionando");
});