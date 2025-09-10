import mongoose from "mongoose";
import User from "../../src/models/users"; // ajusta ruta si tu archivo es user.model.js
import { afterAll, afterEach, beforeAll, describe, expect, it } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcryptjs";

let mongoServer, mockUserData, mockUser;

beforeAll(async () => {
  // Datos de prueba
  mockUserData = { 
    name: "Test User", 
    email: "test@example.com", 
    password: "mypassword123", 
    role: "user" 
  };
  mockUser = new User(mockUserData);

  // Servidor en memoria
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe("User model test", () => {
  it(" Debería guardar un usuario correctamente y encriptar la contraseña", async () => {
    // Act
    const savedUser = await mockUser.save();

    // Assert
    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe("Test User");
    expect(savedUser.email).toBe("test@example.com");
    expect(savedUser.password).not.toBe("mypassword123"); // contraseña debe estar encriptada
    expect(savedUser.role).toBe("user");

    // Verificar que bcrypt realmente encriptó
    const isMatch = await bcrypt.compare("mypassword123", savedUser.password);
    expect(isMatch).toBe(true);
  });

  it(" Debería rechazar emails duplicados", async () => {
    await User.create(mockUserData);

    let err;
    try {
      await User.create(mockUserData);
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // código de duplicado en MongoDB
  });

  it(" Debería fallar si el email no es válido", async () => {
    const invalidUser = new User({ 
      name: "Invalid User", 
      email: "invalid-email", 
      password: "mypassword123" 
    });

    let err;
    try {
      await invalidUser.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.email.message).toContain("Correo no válido");
  });

  it(" Debería fallar si la contraseña es muy corta", async () => {
    const shortPassUser = new User({ 
      name: "Short Password", 
      email: "short@example.com", 
      password: "123" 
    });

    let err;
    try {
      await shortPassUser.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.password).toBeDefined();
    expect(err.errors.password.message).toContain("Mínimo 8 caracteres");
  });

  it(" Debería comparar correctamente contraseñas con comparePassword", async () => {
    const user = new User(mockUserData);
    await user.save();

    const isValid = await user.comparePassword("mypassword123");
    expect(isValid).toBe(true);

    const isInvalid = await user.comparePassword("wrongpassword");
    expect(isInvalid).toBe(false);
  });
});
