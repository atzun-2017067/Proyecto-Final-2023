const { Router } = require('express');
const { check } = require('express-validator');
const { getFactura, postFactura } = require('../controllers/factura');
const { validarStock } = require('../helpers/db-validators');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarJWTProducto } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', [
    validarJWT
], getFactura)

router.post('/comprar', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
],postFactura);

// router.put('/agregarProductos/:id',[
//     validarJWT,
//     tieneRole('CLIENTE')
// ], putCarrito)



module.exports = router;