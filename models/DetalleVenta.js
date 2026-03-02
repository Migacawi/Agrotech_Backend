class DetalleVenta {
    constructor(id_detalle_venta, id_venta, cod_prod, cantidad, precio_libra) {
        this.idDetalleVenta = id_detalle_venta;
        this.idVenta = id_venta;
        this.cod_prod = cod_prod;
        this.cantidad = cantidad;
        this.precio_libra = precio_libra;
    }
}

module.exports = DetalleVenta;