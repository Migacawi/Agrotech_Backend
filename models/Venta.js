class Venta {
    constructor(id_venta,cod_prod, cantidad, documento, fecha_venta, total_producto) {
        this.cod_prod = cod_prod;
        this.id_venta = id_venta;
        this.cantidad = cantidad;
        this.fecha = fecha_venta || new Date();
        this.documento = documento;
        this.total_producto = total_producto;
    }
}

module.exports = Venta;