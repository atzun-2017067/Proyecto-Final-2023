const { response, request } = require('express');

const Carrito = require('../models/carrito');
const Producto = require('../models/producto');

const getCarrito = async (req = request, res = response) => {

  const _id = req.usuario.id;
  //condiciones del get
  const query = { estado: true, usuario: _id };

  const listaCarritos = await Promise.all([
    Carrito.countDocuments(query),
    Carrito.find(query).populate('usuario', 'nombre')
      .populate('producto')
  ]);

  res.json({
    msg: "get Api - Controlador Carrito",
    listaCarritos,
  });
};


const postCarrito = async (req = request, res = response) => {

  const carrito = req.body.carrito.toUpperCase();
  const { producto, cantidadProducto } = req.body;
  const carritoDB = await Carrito.findOne({ carrito });

  let totales = 0;
  let totalFinal = 0;

  //Si el carrito existe no lo agrega.
  if (carritoDB) {
    return res.status(400).json({
      msg: `El carrito ${carritoDB.carrito}, ya existe.`,
    });
  }

  for (let i = 0; i < producto.length; i++) {
    const cantidadDeProducto = cantidadProducto[i];
    const listaProductos = producto[i];
    const query = await Producto.findById(listaProductos);
    let precio = query.precio;
    let cantidad = parseInt(cantidadDeProducto);

    totales = precio * cantidad;

    totalFinal = totales + totalFinal;
    console.log(totalFinal, 'totalFinal');
  }

  //Generar la data a guardar
  const data = {
    carrito,
    usuario: req.usuario._id,
    total: totalFinal
  };

  console.log(data);
  const carritos = await new Carrito(data);
  carritos.producto.push(...producto);
  console.log(carritos, 'CARRITOS');

  await carritos.save();
  res.status(201).json(carritos);
};

const putCarrito = async (req = request, res = response) => {
  const { id } = req.params;
  const { producto, cantidadProducto } = req.body;

  // Busca el carrito existente en la base de datos
  const carrito = await Carrito.findById(id);

  // Si el carrito no existe, regresa un error
  if (!carrito) {
    return res.status(404).json({ error: 'El carrito no existe en la base de datos' });
  }

  // Calcula el total de los nuevos productos
  let totalNuevo = 0;

  for (let i = 0; i < producto.length; i++) {
    const cantidadDeProducto = cantidadProducto[i];
    const listaProductos = producto[i];
    const query = await Producto.findById(listaProductos);

    if (!query) {
      return res.status(404).json({ error: 'El producto no existe en la base de datos' });
    }

    let precio = query.precio;
    let cantidad = parseInt(cantidadDeProducto);
    let subtotal = precio * cantidad;

    totalNuevo += subtotal;
  }

  // Suma el total anterior con el total de los nuevos productos
  let totalFinal = carrito.total + totalNuevo;

  // Actualiza el carrito con los nuevos productos y el total
  carrito.producto.push(...producto);
  carrito.total = totalFinal;

  await carrito.save();

  res.status(200).json(carrito);



  // const { estado, usuario, ...resto } = req.body;

  // if (resto.carrito) {
  //   resto.carrito = resto.carrito.toUpperCase();
  //   resto.producto = [...req.body.producto];
  //   resto.usuario = req.usuario._id;
  // }

  //   resto.carrito = resto.carrito.toUpperCase();
  //   resto.productos = [...req.body.productos];
  //   resto.usuario = req.usuario._id;

  // const carritoEditado = await Carrito.findByIdAndUpdate(id, data, { new: true });

  // res.status(201).json(carritoEditado);
};

module.exports = {
  getCarrito,
  postCarrito,
  putCarrito,
}

//Carrito de compras