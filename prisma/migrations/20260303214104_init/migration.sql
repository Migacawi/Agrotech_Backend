BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[DetallePedido] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [PedidoId] INT NOT NULL,
    [ProductoId] INT NOT NULL,
    [CantidadLibras] DECIMAL(10,2) NOT NULL,
    [PrecioUnitario] DECIMAL(10,2) NOT NULL,
    [Subtotal] DECIMAL(12,2) NOT NULL,
    CONSTRAINT [PK__DetalleP__3214EC07F2DFB81F] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[ImagenesProducto] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [ProductoId] INT NOT NULL,
    [UrlImagen] VARCHAR(500) NOT NULL,
    [EsPrincipal] BIT CONSTRAINT [DF__ImagenesP__EsPri__4316F928] DEFAULT 0,
    [FechaSubida] DATETIME CONSTRAINT [DF__ImagenesP__Fecha__440B1D61] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Imagenes__3214EC07B2518B9B] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Pagos] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [PedidoId] INT NOT NULL,
    [MetodoPago] VARCHAR(50) NOT NULL,
    [Estado] VARCHAR(50) NOT NULL,
    [FechaPago] DATETIME,
    CONSTRAINT [PK__Pagos__3214EC077C2998F4] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [UQ__Pagos__09BA14314458DE21] UNIQUE NONCLUSTERED ([PedidoId])
);

-- CreateTable
CREATE TABLE [dbo].[Pedidos] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [CompradorId] INT NOT NULL,
    [FechaPedido] DATETIME CONSTRAINT [DF__Pedidos__FechaPe__47DBAE45] DEFAULT CURRENT_TIMESTAMP,
    [Estado] VARCHAR(50) CONSTRAINT [DF__Pedidos__Estado__48CFD27E] DEFAULT 'Pendiente',
    [Total] DECIMAL(12,2) NOT NULL,
    CONSTRAINT [PK__Pedidos__3214EC07B3B69580] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Productos] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [Nombre] VARCHAR(150) NOT NULL,
    [Descripcion] TEXT,
    [Categoria] VARCHAR(50) NOT NULL,
    [PrecioPorLibra] DECIMAL(10,2) NOT NULL,
    [StockLibras] DECIMAL(10,2) NOT NULL,
    [VendedorId] INT NOT NULL,
    [FechaPublicacion] DATETIME CONSTRAINT [DF__Productos__Fecha__3F466844] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Producto__3214EC07DEAEC916] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Roles] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [Nombre] VARCHAR(50) NOT NULL,
    CONSTRAINT [PK__Roles__3214EC07758F4AD1] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [UQ__Roles__75E3EFCF176E5DCF] UNIQUE NONCLUSTERED ([Nombre])
);

-- CreateTable
CREATE TABLE [dbo].[sysdiagrams] (
    [name] NVARCHAR(128) NOT NULL,
    [principal_id] INT NOT NULL,
    [diagram_id] INT NOT NULL IDENTITY(1,1),
    [version] INT,
    [definition] VARBINARY(max),
    CONSTRAINT [PK__sysdiagr__C2B05B61631EF481] PRIMARY KEY CLUSTERED ([diagram_id]),
    CONSTRAINT [UK_principal_name] UNIQUE NONCLUSTERED ([principal_id],[name])
);

-- CreateTable
CREATE TABLE [dbo].[Usuarios] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [Nombre] VARCHAR(100) NOT NULL,
    [Email] VARCHAR(100) NOT NULL,
    [PasswordHash] VARCHAR(255) NOT NULL,
    [RolId] INT NOT NULL,
    [FechaRegistro] DATETIME CONSTRAINT [DF__Usuarios__FechaR__3B75D760] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PK__Usuarios__3214EC0755505276] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [UQ__Usuarios__A9D105348273CCB6] UNIQUE NONCLUSTERED ([Email])
);

-- AddForeignKey
ALTER TABLE [dbo].[DetallePedido] ADD CONSTRAINT [FK_Detalle_Pedido] FOREIGN KEY ([PedidoId]) REFERENCES [dbo].[Pedidos]([Id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DetallePedido] ADD CONSTRAINT [FK_Detalle_Producto] FOREIGN KEY ([ProductoId]) REFERENCES [dbo].[Productos]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ImagenesProducto] ADD CONSTRAINT [FK_Imagenes_Productos] FOREIGN KEY ([ProductoId]) REFERENCES [dbo].[Productos]([Id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Pagos] ADD CONSTRAINT [FK_Pagos_Pedidos] FOREIGN KEY ([PedidoId]) REFERENCES [dbo].[Pedidos]([Id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Pedidos] ADD CONSTRAINT [FK_Pedidos_Usuarios] FOREIGN KEY ([CompradorId]) REFERENCES [dbo].[Usuarios]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Productos] ADD CONSTRAINT [FK_Productos_Usuarios] FOREIGN KEY ([VendedorId]) REFERENCES [dbo].[Usuarios]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Usuarios] ADD CONSTRAINT [FK_Usuarios_Roles] FOREIGN KEY ([RolId]) REFERENCES [dbo].[Roles]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
