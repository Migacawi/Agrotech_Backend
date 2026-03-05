IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'Db_Agrotech')
BEGIN
    CREATE DATABASE [Db_Agrotech];
END
GO