 class Producto {
    constructor(cod_prod, precio_libra,descripcion,fecha_registro,fecha_cosecha, imagen) {
        this.cod_prod = cod_prod;
        this.precio_libra = precio_libra;
        this.descripcion = descripcion;
        this.fecha_registro = fecha_registro;   
        this.fecha_cosecha = fecha_cosecha;
        this.imagen = imagen;
    }
}

module.exports = Producto; 