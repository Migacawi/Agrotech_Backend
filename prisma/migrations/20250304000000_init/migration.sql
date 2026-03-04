-- CreateTable
CREATE TABLE [dbo].[Roles] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [Nombre] NVARCHAR(50) NOT NULL,
    CONSTRAINT [PK__Roles__3214EC07758F4AD1] PRIMARY KEY ([Id]),
    CONSTRAINT [UQ__Roles__75E3EFCF176E5DCF] UNIQUE ([Nombre])
);

-- CreateTable
CREATE TABLE [dbo].[Usuarios] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [Nombre] NVARCHAR(100) NOT NULL,
    [Email] NVARCHAR(100) NOT NULL,
    [PasswordHash] NVARCHAR(255) NOT NULL,
    [RolId] INT NOT NULL,
    [FechaRegistro] DATETIME DEFAULT getdate(),
    CONSTRAINT [PK__Usuarios__3214EC0755505276] PRIMARY KEY ([Id]),
    CONSTRAINT [UQ__Usuarios__A9D105348273CCB6] UNIQUE ([Email]),
    CONSTRAINT [FK_Usuarios_Roles] FOREIGN KEY ([RolId]) REFERENCES [dbo].[Roles] ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Productos] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [Nombre] NVARCHAR(150) NOT NULL,
    [Descripcion] NVARCHAR(MAX),
    [Categoria] NVARCHAR(50) NOT NULL,
    [PrecioPorLibra] DECIMAL(10,2) NOT NULL,
    [StockLibras] DECIMAL(10,2) NOT NULL,
    [VendedorId] INT NOT NULL,
    [FechaPublicacion] DATETIME DEFAULT getdate(),
    CONSTRAINT [PK__Producto__3214EC07DEAEC916] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Productos_Usuarios] FOREIGN KEY ([VendedorId]) REFERENCES [dbo].[Usuarios] ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Pedidos] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [CompradorId] INT NOT NULL,
    [FechaPedido] DATETIME DEFAULT getdate(),
    [Estado] NVARCHAR(50) DEFAULT 'Pendiente',
    [Total] DECIMAL(12,2) NOT NULL,
    CONSTRAINT [PK__Pedidos__3214EC07B3B69580] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Pedidos_Usuarios] FOREIGN KEY ([CompradorId]) REFERENCES [dbo].[Usuarios] ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Pagos] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [PedidoId] INT NOT NULL,
    [MetodoPago] NVARCHAR(50) NOT NULL,
    [Estado] NVARCHAR(50) NOT NULL,
    [FechaPago] DATETIME,
    CONSTRAINT [PK__Pagos__3214EC077C2998F4] PRIMARY KEY ([Id]),
    CONSTRAINT [UQ__Pagos__09BA14314458DE21] UNIQUE ([PedidoId]),
    CONSTRAINT [FK_Pagos_Pedidos] FOREIGN KEY ([PedidoId]) REFERENCES [dbo].[Pedidos] ([Id]) ON DELETE CASCADE
);

-- CreateTable
CREATE TABLE [dbo].[DetallePedido] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [PedidoId] INT NOT NULL,
    [ProductoId] INT NOT NULL,
    [CantidadLibras] DECIMAL(10,2) NOT NULL,
    [PrecioUnitario] DECIMAL(10,2) NOT NULL,
    [Subtotal] DECIMAL(12,2) NOT NULL,
    CONSTRAINT [PK__DetalleP__3214EC07F2DFB81F] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Detalle_Pedido] FOREIGN KEY ([PedidoId]) REFERENCES [dbo].[Pedidos] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Detalle_Producto] FOREIGN KEY ([ProductoId]) REFERENCES [dbo].[Productos] ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[ImagenesProducto] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [ProductoId] INT NOT NULL,
    [UrlImagen] NVARCHAR(500) NOT NULL,
    [EsPrincipal] BIT DEFAULT 0,
    [FechaSubida] DATETIME DEFAULT getdate(),
    CONSTRAINT [PK__Imagenes__3214EC07B2518B9B] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Imagenes_Productos] FOREIGN KEY ([ProductoId]) REFERENCES [dbo].[Productos] ([Id]) ON DELETE CASCADE
);

-- CreateTable
CREATE TABLE [dbo].[Sysdiagrams] (
    [name] NVARCHAR(128) NOT NULL,
    [principal_id] INT NOT NULL,
    [diagram_id] INT NOT NULL IDENTITY(1,1),
    [version] INT,
    [definition] VARBINARY(MAX),
    CONSTRAINT [PK__sysdiagr__C2B05B61631EF481] PRIMARY KEY ([diagram_id]),
    CONSTRAINT [UK_principal_name] UNIQUE ([principal_id], [name])
);
