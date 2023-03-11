const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const getUsuarios = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true };

    const listaUsuarios = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    res.json({
        msg: 'get Api - Controlador Usuario',
        listaUsuarios
    });

}

const postUsuarioCliente = async (req = request, res = response) => {

    //Desestructuración
    const { nombre, correo, password } = req.body;
    const usuarioGuardadoDB = new Usuario({ nombre, correo, password, rol: 'CLIENTE' });

    //Encriptar password
    const salt = bcrypt.genSaltSync();
    usuarioGuardadoDB.password = bcrypt.hashSync(password, salt);

    //Guardar en BD
    await usuarioGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Usuario',
        usuarioGuardadoDB
    });

}

const postUsuario = async (req = request, res = response) => {

    //Desestructuración
    const { nombre, correo, password } = req.body;
    const usuarioGuardadoDB = new Usuario({ nombre, correo, password, rol: 'ADMIN' });

    //Encriptar password
    const salt = bcrypt.genSaltSync();
    usuarioGuardadoDB.password = bcrypt.hashSync(password, salt);

    //Guardar en BD
    await usuarioGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Usuario',
        usuarioGuardadoDB
    });

}


const putUsuario = async (req = request, res = response) => {

    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;
    const { _id, img, rol, estado, google, ...resto } = req.body;

    try {
        const usuarioActual = await Usuario.findById(req.usuario._id);
        console.log(usuarioActual);
        if (usuarioActual.rol !== 'ADMIN') {
            throw new Error('El usuario no tiene permiso para realizar esta acción');
        }
        const usuarioAEditar = await Usuario.findById(id);
        if (usuarioAEditar.rol === 'ADMIN') {
            throw new Error('No se puede editar a otro administrador');
        }
    } catch (error) {
        return res.status(403).json({
            msg: 'No tienes permisos para editar este usuario',
        });
    }
    //Los parametros img, rol, estado y google no se modifican, el resto de valores si (nombre, correo y password)

    //Si la password existe o viene en el req.body, la encripta
    if ( resto.password ) {
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

    //Editar al usuario por el id
    const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'PUT editar user',
        usuarioEditado
    });

}

const deleteUsuario = async(req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const { id } = req.params;

    try {
        const usuarioActual = await Usuario.findById(req.usuario._id);
        if (usuarioActual.rol !== 'ADMIN') {
            throw new Error('El usuario no tiene permiso para realizar esta acción');
        }
        const usuarioAEliminar = await Usuario.findById(id);
        if (usuarioAEliminar.rol === 'ADMIN') {
            throw new Error('No se puede eliminar a otro administrador');
        }
    } catch (error) {
        return res.status(403).json({
            msg: 'No tienes permisos para eliminar este usuario',
            error: error.message
        });
    }

    // Eliminar al usuario por el id
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);

    res.json({
        msg: 'DELETE eliminar user',
        usuarioEliminado
    });
}

module.exports = {
    getUsuarios,
    postUsuario,
    postUsuarioCliente,
    putUsuario,
    deleteUsuario
}


// CONTROLADOR