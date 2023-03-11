const { Schema, model } = require('mongoose');

const CarritoSchema = Schema({
    carrito: {
        type: String,
        required: [true , 'El nombre de la cateogira es obligatorio'],
        unique: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    producto: [{
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        default: null
    }],
    total: {
        type: Number,
        default: 0
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    }
});


module.exports = model('Carrito', CarritoSchema);