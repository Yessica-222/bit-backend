# Electro Tecnológicas Cauca - Sistema E-commerce Completo

Este repositorio contiene el **backend** del e-commerce **Electro Tecnológicas Cauca**, especializado en la **venta de productos tecnológicos**.  
Ofrece funcionalidades completas: gestión de usuarios, productos, carrito, citas técnicas, facturación y pagos.

---

## 🚀 Tecnologías principales

- **Backend**  
  Node.js · Express.js · MongoDB + Mongoose · JWT · Bcrypt · Morgan · CORS · Dotenv  

---

## 📂 Estructura de carpetas

```bash 
bit-backend/
├── node_modules/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── appointment.js
│   │   ├── cart.js
│   │   ├── invoice.js
│   │   ├── payment.js
│   │   ├── products.js
│   │   ├── service.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── appointment.js
│   │   ├── cart.js
│   │   ├── invoice.js
│   │   ├── payment.js
│   │   ├── products.js
│   │   ├── service.js
│   │   └── users.js
│   ├── routes/
│   │   ├── appointment.js
│   │   ├── cart.js
│   │   ├── invoice.js
│   │   ├── payment.js
│   │   ├── products.js
│   │   ├── service.js
│   │   └── users.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md 
```
----
## 📌 Endpoints 

### Usuarios
- **POST** `/api/users/sign-up` — Registro  
- **POST** `/api/users/sign-in` — Login (token JWT)  
- **GET** `/api/users/profile` — Perfil (autenticado)  
- **PUT** `/api/users/profile` — Actualizar perfil  
- **GET** `/api/users/admin-panel` — Panel admin  

### Productos
- **POST** `/api/products` — Crear producto (admin)  
- **GET** `/api/products` — Listar productos  
- **GET** `/api/products/:id` — Detalle producto  
- **PUT** `/api/products/:id` — Editar producto  
- **DELETE** `/api/products/:id` — Eliminar producto  

### Carrito
- **POST** `/api/cart` — Agregar al carrito  
- **GET** `/api/cart` — Ver carrito  
- **GET** `/api/cart/total` — Total carrito  
- **PUT** `/api/cart/:id_cart` — Ajustar cantidad  
- **DELETE** `/api/cart/:id_cart` — Eliminar producto  

### Facturas / Pedidos
- **POST** `/api/invoices/mine` — Crear factura (usuario)  
- **GET** `/api/invoices/mine` — Ver facturas  
- **POST** `/api/invoices` — Crear (admin)  
- **GET** `/api/invoices` — Listar todas (admin)  
- **PUT** `/api/invoices/:id` — Actualizar factura (admin)  
- **DELETE** `/api/invoices/:id` — Eliminar factura (admin)  

### Citas
- **POST** `/api/appointment` — Agendar cita  
- **GET** `/api/appointment/my` — Ver mis citas  
- **GET** `/api/appointment` — Listar todas  
- **PUT** `/api/appointment/:id` — Modificar cita  
- **DELETE** `/api/appointment/:id` — Cancelar cita  

### Pagos
- **POST** `/api/payment` — Crear pago  
- **GET** `/api/payment` — Ver pagos (admin)  
- **GET** `/api/payment/invoice/:invoiceId` — Pagos por factura  
- **PUT** `/api/payment/:id` — Cambiar estado (admin)  
- **DELETE** `/api/payment/:id` — Eliminar pago (admin)  

---

## Roles y acceso
### Administrador
- Control total: Usuarios, productos, facturas, pagos, servicios.  

### Cliente / Usuario
- Registro, login, carrito, citas, pedidos y pagos.  

---

## Frontend (HTML + CSS + JS)
- Navegación dinámica según autenticación.  
- Login / Registro, carrito, perfil.  
- Gestión de citas técnicas.  
- Panel admin para productos, facturas y pagos.  

 **El frontend está listo para consumir la API en:**  
`http://localhost:5000/api`

## Instalación y configuración

### Clonar el repositorio:
```bash
git clone https://github.com/Yessica-222/bit-backend
cd bit-backend
```
---
### Instalar dependencias
```bash
 npm install 
```
---

### Crear archivo **.env** en la raiz con las siguientes variables:
```bash
PORT=5000
MONGODB_URI=mongodb+srv://Yessica:1002@cluster0.o3qf6yz.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0
SECRET_KEY=clave_super_secreta
```
### Iniciar el servidor
```bash
npm run dev
```
### Requisitos previos

 - Node.js >= 16

 - MongoDB >= 6

 - npm o yarn instalado

### Pruebas con Postman

* curl -X POST http://localhost:5000/api/users/sign-up \
   -H "Content-Type: application/json" \
   -d '{"name":"Yessica","email":"yessica@gmail.com","password":"12345678"}'

### 👩‍💻 Autor  

Desarrollado por **Yessica Alexandra Conejo Muñoz**  

📍 Popayán, Colombia  
📧 Contacto: [munozyessica769@gmail.com](mailto:munozyessica769@gmail.com)  
🔗 LinkedIn: [www.linkedin.com/in/yessica-alexandra-conejo-munoz-desarrolladorweb](https://www.linkedin.com/in/yessica-alexandra-conejo-munoz-desarrolladorweb)
