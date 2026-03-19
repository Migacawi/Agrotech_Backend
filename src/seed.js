const prisma = require('./prisma/client');

async function seed() {

  // ── Roles ──────────────────────────────────────────────────────────────
  const roles = ['Vendedor', 'Administrador'];

  for (const nombre of roles) {
    await prisma.roles.upsert({
      where:  { Nombre: nombre },
      update: {},
      create: { Nombre: nombre },
    });
    console.log(`Rol "${nombre}" verificado ✔`);
  }

  // ── Administradores ────────────────────────────────────────────────────
  const admins = [
    { Nombre: 'Nicolas Acosta',    Email: 'niko.Admin@agrotech.com',   PasswordHash: 'Admin1234' },
    { Nombre: 'Gabriel Castellanos', Email: 'Gabi.Admin@agrotech.com', PasswordHash: 'Admin1234' },
    { Nombre: 'Andres Felipe',     Email: 'andres.Admin@agrotech.com', PasswordHash: 'Admin1234' },
  ];

  for (const admin of admins) {
    await prisma.usuarios.upsert({
      where:  { Email: admin.Email },
      update: {},
      create: {
        Nombre:       admin.Nombre,
        Email:        admin.Email,
        PasswordHash: admin.PasswordHash,
        Rol:          { connect: { Nombre: 'Administrador' } },
      },
    });
    console.log(`Admin "${admin.Nombre}" verificado ✔`);
  }

  console.log('✅ Seed completado');
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});