const { request, response } = require('express');
const bcrypt = require('bcryptjs');

const { generarJWT } = require('../helpers/generar-jwt');
const Usuario = require('../models/usuario');
const Factura = require('../models/factura');

const login = async (req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        //Verficiar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - (El correo no existe jaja)'
            });
        }

        //Si el usuario esta activo (estado = false)
        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }
        
        //Verificar la password
        const validarPassword = bcrypt.compareSync( password, usuario.password );
        if ( !validarPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - (password incorrecta)'
            });
        }

        //Generar JWT
        const token = await generarJWT( usuario.id );

        const facturas = await Factura.find({ cliente: usuario.id });

        res.json({
            msg: 'Login PATH',
            correo, password,
            token,
            compras: facturas
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador (BackEnd)'
        });
    }



}


module.exports = {
    login
}


// const pipeline = [
//     { $unwind: "$productos" },
//     { $group: { _id: "$productos.id", cantidad_vendida: { $sum: "$productos.cantidad" } } },
//     { $sort: { cantidad_vendida: -1 } },
//     { $limit: 10 }
// ];

// const collectionVentas = db.collection("ventas");

// collectionVentas.aggregate(pipeline).toArray(function(err, productosMasVendidos) {
//     console.log(productosMasVendidos);
// });
