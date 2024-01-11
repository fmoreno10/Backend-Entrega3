import fs2 from 'fs';
import fs from 'fs/promises';

class Product {
    static #newProductID = 0;

    constructor({ title, description, price, thumbnail, code, stock }) {
        // Validaciones
        if (!title || !description || !price || !thumbnail || !code || !stock) throw new Error('Los campos no pueden estar vacíos.');

        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.id = Product.#newProductID++;
    }

}

class ProductManager {
    #path;
    #products;
    constructor(path) {
        this.#path = path;
        this.#products = [];
    }

    /*
    agregará un producto al arreglo de productos inicial.
    Validar que no se repita el campo “code” y que todos los campos sean obligatorios
    Al agregarlo, debe crearse con un id autoincrementable
    
    */
    async addProduct(oProduct) {
        let id = -1;
        let productsInFile;

        if (fs2.existsSync(this.#path)) {
            try {
                // leo los productos almacenados previamente
                productsInFile = await fs.readFile(this.#path, 'utf-8');
            } catch (err) {
                console.log(err);
                return id;
            }
        }        // convierto lo leído en el archivo en objetos
        const oProducts = JSON.parse(productsInFile);

        if (this.#products.some(product => product.code === oProduct.code)) {
            id = 0;
        } else {
            const oNewProduct = new Product(oProduct);

            id = oNewProduct.id;
            this.#products.push(oNewProduct);
            // escribo al archivo el array de productos convertido a texto , le agrego identación para legilibilidad (2)
            await fs.writeFile(this.#path, JSON.stringify(this.#products, null, 2));

        }


        return id;
    }

    async updateProduct(productID, newProduct) {
        let id;
        let productsInFile;
        try {
            // leo los productos almacenados previamente
            productsInFile = await fs.readFile(this.#path, 'utf-8');
        } catch (err) {
            console.log(err);
            return id;
        }
        //NO DEBE BORRARSE SU ID 
        const oProducts = JSON.parse(productsInFile);

        // busco el producto a modificar
        const updatedProduct = oProducts.find(product => product.id === productID);

        //updatedProduct = [id, ...newProduct]; // newProduct is not iterable
        //updatedProduct = [id, ...newProduct]

        // Elimino el producto que coincide con el ID, creo un nuevo array que no lo incluya
        const newProducts = oProducts.filter(product => product.id !== productID);

        // Agrego el producto modificado
        oProducts.push(updatedProduct);

        // escribo al archivo el array de productos convertido a texto , le agrego identación para legilibilidad (2)
        await fs.writeFile(this.#path, JSON.stringify(oProducts, null, 2));
    }

    async deleteProduct(productID) {
        let productsInFile;
        let id;
        try {
            // leo los productos almacenados previamente
            productsInFile = await fs.readFile(this.#path, 'utf-8');
        } catch (err) {
            console.log(err);
            return id;
        }
        const oProducts = JSON.parse(productsInFile);
        // Elimino el producto que coincide con el ID, creo un nuevo array que no lo incluya
        const newProducts = oProducts.filter(product => product.id !== productID);

        // escribo al archivo el array de productos nuevo convertido a texto , le agrego identación para legilibilidad (2)
        await fs.writeFile(this.#path, JSON.stringify(newProducts, null, 2));


    }

    // debe devolver el arreglo con todos los productos creados hasta ese momento
    async getProducts() {
        let productsInFile;

        try {
            // leo los productos almacenados previamente
            productsInFile = await fs.readFile(this.#path, 'utf-8');
        } catch (err) {
            console.log(err);
            return id;
        }
        // convierto lo leído en el archivo en objetos y devuelvo
        //console.log(productsInFile);
        //console.log(JSON.parse(productsInFile));
        return JSON.parse(productsInFile);;

    }

    /*
    el cual debe buscar en el arreglo el producto que coincida con el id
    En caso de no coincidir ningún id, mostrar en consola un error “Not found”
    */
    async getProductById(productID) {
        let productsInFile;
        try {
            // leo los productos almacenados previamente
            productsInFile = await fs.readFile(this.#path, 'utf-8');
        } catch (err) {
            console.log(err);
            return id;
        }
        // convierto lo leído en el archivo en objetos
        const oProducts = JSON.parse(productsInFile);

        return oProducts.find(product => product.id === productID);

    }

}

// 0. Creo el producto de testing
const oTestProduct = new Product({
    title: 'producto prueba',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc123',
    stock: 25
});

console.clear();

const sPath = './products.json';

const oProductManager = new ProductManager(sPath);
console.log("1. Se creará una instancia de la clase 'ProductManager'");
console.log(oProductManager);

//console.log("2. Se llamará 'getProducts' recién creada la instancia, debe devolver un arreglo vacío []");
//console.log(oProductManager.getProducts());

console.log("3. Se llamará al método 'addProduct' con los campos de testing.");

let oNewProductID = oProductManager.addProduct(oTestProduct);

if (oNewProductID) {
    console.log(`Producto agregado. ID: ${oNewProductID}`);
} else {
    console.log(`Ya existe un producto con el código: "${oTestProduct.code}"`);
}

//console.log("5. Se llamará el método 'getProducts' nuevamente, esta vez debe aparecer el producto recién agregado.");
//console.log(oProductManager.getProducts());

/*
console.log("6. Se llamará al método 'addProduct' con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.");
let oNewProductID2 = oProductManager.addProduct(oTestProduct);

if (oNewProductID2) {
    console.log(`Producto agregado. ID: ${oNewProductID2}`);
} else {
    console.log(`Ya existe un producto con el código: "${oTestProduct.code}"`);
}
*/
console.log("7. Se evaluará que 'getProductById' devuelva error si no encuentra el producto o el producto en caso de encontrarlo.");
const oProductToFind = oProductManager.getProductById(oNewProductID);
if (oProductToFind) {
    console.log(oProductToFind);
} else {
    console.log(`ID: ${oNewProductID} Not found.`);
}
/*
let nonExistentID = 2;
// 7. Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo
const oProductToFind2 = oProductManager.getProductById(nonExistentID);
if (oProductToFind2) {
    console.log(oProductToFind2);
} else {
    console.log(`ID: ${nonExistentID} Not found.`);
}

// 8. Agrego un nuevo producto para modificar y eliminar
const oNewProduct = new Product({
    title: 'producto nuevo',
    description: 'Este es un producto nuevo',
    price: 500,
    thumbnail: 'Nueva imagen',
    code: 'cod1',
    stock: 75
});

console.log("// 8. Agrego un nuevo producto para modificar y eliminar");
let oNewProductID3 = oProductManager.addProduct(oNewProduct);

if (oNewProductID3) {
    console.log(`Producto agregado. ID: ${oNewProductID3}`);
} else {
    console.log(`Ya existe un producto con el código: "${oNewProduct.code}"`);
}

console.log(oProductManager.getProducts());
*/
/*
// 8. Modificar el producto con ID: oNewProductID3
const oModProduct = new Product({
    title: 'producto modificado',
    description: 'Este es un producto modificado',
    price: 250,
    thumbnail: 'Con imagen',
    code: 'zxy321',
    stock: 45
});

oProductManager.updateProduct(oNewProductID3, oModProduct);
console.log(oProductManager.getProducts());

// 9. Eliminar el prodcuto con ID: oNewProductID3
oProductManager.deleteProduct(oNewProductID3);
console.log(oProductManager.getProducts());
*/
export default oProductManager;