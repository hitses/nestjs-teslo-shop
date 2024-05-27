<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Teslo API

1. Clonar proyecto
2. Instalar dependencias

```bash
npm install
```

3. Copiar el archivo .env.template a .env y configurar las variables de entorno

4. Levantar la base de datos PostgreSQL:

```bash
docker-compose up -d
```

5. Ejecutar aplicación

```bash
npm run start:dev
```

6. Restaurar base de datos

```bash
http://localhost:3000/api/seed
```
