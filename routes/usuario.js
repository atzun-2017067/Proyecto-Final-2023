//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, postUsuario, putUsuario, deleteUsuario, postUsuarioCliente } = require('../controllers/usuario');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole, esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', getUsuarios);

router.post('/agregar-cliente', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE', 'PROFESOR_ROLE']),
    validarCampos,
] ,postUsuarioCliente);

router.post('/agregar', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE', 'PROFESOR_ROLE']),
    //check('rol').custom(esRoleValido),
    validarCampos,
] ,postUsuario);

router.put('/editar/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] ,putUsuario);


router.delete('/eliminar/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] ,deleteUsuario);


module.exports = router;


// ROUTES