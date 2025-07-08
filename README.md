# Backend E-commerce - Gestión de Productos y Pedidos

Este proyecto es un backend básico para una tienda online, diseñado para gestionar productos y pedidos de forma sencilla usando Node.js, Express y MongoDB.

---

## Objetivo

Simular la estructura y funcionalidades de un sistema de comercio electrónico con:

- CRUD de productos
- Gestión de pedidos (crear y actualizar estado)
- Arquitectura RESTful
- Conexión con MongoDB Atlas (en la nube)
- Proyecto listo para escalar

---

## Funcionalidades

### Productos
- Crear productos
- Listar todos los productos
- Consultar un producto por ID
- Editar producto
- Eliminar producto

### Pedidos (estructura básica lista para implementar)
- Crear pedido (estructura preparada)
- Actualizar estado del pedido (`pendiente`, `enviado`, `entregado`)
- Obtener listado de pedidos

> **Nota:** En esta primera versión no se incluye autenticación ni usuarios.

---

## 🛠 Tecnologías utilizadas

| Tecnología       | Uso                         |
|------------------|------------------------------|
| **Node.js + Express** | Backend y manejo de rutas        |
| **MongoDB Atlas**     | Base de datos NoSQL en la nube   |
| **Mongoose**          | Modelado de datos                |
| **dotenv**            | Variables de entorno             |
| **morgan**            | Logs de peticiones HTTP          |
| **Nodemon**           | Recarga automática en desarrollo |
| **Postman / Thunder Client** | Pruebas de API              |

---

## 📁 Estructura del proyecto
bit-backend/

├── config/

│ └── db.js # Conexión a MongoDB Atlas

├── controllers/

│ └── products.js

├── models/

│ └── Product.js

├── routes/

│ └── products.js

├── src/

│ └── server.js

├── .env

├── package.json

└── README.md


---

## Endpoints disponibles

###  Productos

| Método | Ruta                         | Descripción               |
|--------|------------------------------|---------------------------|
| POST   | `/api/products`              | Crear producto            |
| GET    | `/api/products`              | Listar productos          |
| GET    | `/api/products/:id`          | Obtener producto por ID   |
| PUT    | `/api/products/:id`          | Actualizar producto       |
| DELETE | `/api/products/:id`          | Eliminar producto         |

---
## ✨ Autor

Desarrollado por  **Yessica Alexandra Conejo Muñoz**

📍 Popayán, Colombia  
📧 Contacto: [correo](mailto:munozyessica769@gmail.com)  
🔗 LinkedIn: [linkedin](www.linkedin.com/in/yessica-alexandra-conejo-munoz-desarrolladorweb)

