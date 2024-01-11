import express from 'express';
import oProductManager from './ProductManager.js';

const app = express();

app.use(express.urlencoded({ extended: true })) 
app.use(express.json()) 

app.get("/ping", (req, res) => {
    res.send("pong");
});

app.get("/products", async (req, res) => {    
    let oProducts = await oProductManager.getProducts();    
    res.send(oProducts);
});

app.get("/products/:id", async (req, res) => {    
    let id = req.params.id 
    let oProduct = await oProductManager.getProductById(id);    
    if( oProduct){
        res.send(oProduct);
    }else{
        res.status(400).send(`No se encontro el producto con ID= ${id}`);
    }    
});

app.listen(3000, () => {
    console.log("App funcionando");
});