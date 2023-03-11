const { Router } = require('express');
const { check } = require('express-validator');
const { putCarrito, getCarrito, postCarrito } = require('../controllers/carrito');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarJWTProducto } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar',[
    validarJWT
] ,getCarrito)

router.post('/agregar',[
    validarJWT,
    tieneRole('CLIENTE'),
    check('carrito', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], postCarrito)

router.put('/agregarProductos/:id',[
    validarJWT,
    tieneRole('CLIENTE')
], putCarrito)



module.exports = router;