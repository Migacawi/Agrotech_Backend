# Agrotech_Backend
https://res.cloudinary.com/dg2uzc4yg/image/upload/v1773695971/agrotech/productos/lr038jmoa6zyhrxyms7s.png
https://res.cloudinary.com/dg2uzc4yg/image/upload/v1773696622/agrotech/productos/istf6bnlsw22zb9qmt06.jpg


 docker exec -it mssql_tools bash
 sqlcmd -S sqlserver_db -U sa -P Admin1234
create database Db_Agrotech
go
docker  exec -it backend_app bash
npx prisma migrate deploy