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

        updatedProduct = [id, ...newProduct]; 

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
    // Agrego un limite para devolver solo la cantidad indicada
    async getProducts(limit) {
        let productsInFile;

        try {
            // leo los productos almacenados previamente
            productsInFile = await fs.readFile(this.#path, 'utf-8');
        } catch (err) {
            console.log(err);
            return id;
        }
        // convierto lo leído en el archivo en objetos y devuelvo
        let oProducts = JSON.parse(productsInFile);

        if (limit) {
            return oProducts.slice(0, limit);
        } else {
            return oProducts;
        }
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

const sPath = './products.json';

const oProductManager = new ProductManager(sPath);

export default oProductManager;