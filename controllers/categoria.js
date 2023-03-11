const { request, response } = require('express');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');


const getCategorias = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true };

    const listaCategorias = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query).populate('usuario', 'nombre')
    ]);

    res.json({
        msg: 'get Api - Controlador Usuario',
        listaCategorias
    });

}


const getCategoriaPorID = async (req = request, res = response) => {

    const { id } = req.params;
    const categoriaById = await Categoria.findById(id).populate('usuario', 'nombre');

    res.status(201).json(categoriaById);

}


const postCategoria = async (req = request, res = response) => {
    //toUpperCase para todo a Mayusculas
    const categoriaPorDefecto = req.body.categoriaPorDefecto;

    const categoriaDB = await Categoria.findOne({ nombre: req.body.nombre.toUpperCase() });

    //validacion para verificar si ya existe dicha categoria para que no lo agregue
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        categoriaPorDefecto,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    //Guardar en DB
    await categoria.save();

    res.status(201).json(categoria);

}


const putCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...resto } = req.body;

    resto.nombre = resto.nombre.toUpperCase();
    resto.usuario = req.usuario._id;

    const categoriaDB = await Categoria.findOne({ nombre: req.body.nombre.toUpperCase() });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    //Editar o actualiar la cateogira
    const categoriaEditada = await Categoria.findByIdAndUpdate(id, resto, { new: true });

    res.status(201).json(categoriaEditada);

}

const deleteCategoria = async (req = request, res = response) => {

    // const { id } = req.params;

    // //Editar o actualiar la cateogira: Estado FALSE
    // const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    // res.status(201).json(categoriaBorrada);

    const { id } = req.params;

    try {
        const categoria = await Categoria.findById(id);

        if (!categoria) {
            return res.status(404).json({ error: 'La categoría no existe' });
        }

        if (categoria.categoriaPorDefecto) {
            return res.status(400).json({ error: 'No se puede eliminar una categoría por defecto' });
        }

        const productos = await Producto.find({ categoria: categoria._id });

        if (productos.length > 0) {
            const categoriaPorDefecto = await Categoria.findOne({ categoriaPorDefecto: true });

            if (!categoriaPorDefecto) {
                return res.status(400).json({ error: 'No hay una categoría por defecto' });
            }

            await Promise.all(
                productos.map(async (producto) => {
                    producto.categoria = categoriaPorDefecto._id;
                    await producto.save();
                })
            );
        }

        await categoria.remove();

        res.json({ mensaje: 'Categoría eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la categoría' });
    }

}




module.exports = {
    getCategorias,
    getCategoriaPorID,
    postCategoria,
    putCategoria,
    deleteCategoria
}
