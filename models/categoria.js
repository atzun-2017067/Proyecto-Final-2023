const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true , 'El nombre de la cateogira es obligatorio'],
        unique: true
    },
    categoriaPorDefecto: {
        type: Boolean,
        default: false
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});


module.exports = model('Categoria', CategoriaSchema);