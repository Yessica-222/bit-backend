import { afterEach, describe, expect, it, jest } from '@jest/globals';

// Mock de funciones de User
const saveMock = jest.fn();
jest.unstable_mockModule('../../src/models/users.js', () => {
  const mockConstructor = jest.fn(() => ({ save: saveMock, comparePassword: jest.fn() }));
  mockConstructor.findOne = jest.fn();
  mockConstructor.find = jest.fn();
  mockConstructor.findById = jest.fn();
  mockConstructor.findByIdAndUpdate = jest.fn();
  return { default: mockConstructor };
});

// Mock de getToken
jest.unstable_mockModule('../../src/utils/token.js', () => ({
  getToken: jest.fn(() => "fake-jwt-token")
}));

// Importamos el controlador con los mocks ya aplicados
const UsersController = (await import('../../src/controllers/users.js')).default;
const User = (await import('../../src/models/users.js')).default;
const { getToken } = await import('../../src/utils/token.js');

// Variables globales de prueba
let res, reqMock, emptyBodyReq;
beforeAll(() => {
  reqMock = { body: { name: "Test User", email: "test@test.com", password: "123456", role: "user" } };
  emptyBodyReq = { body: {} };
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("UsersController - register", () => {
  it("Debería registrar un usuario nuevo", async () => {
    User.findOne.mockResolvedValue(null);
    saveMock.mockResolvedValue(true);

    await UsersController.register(reqMock, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Usuario registrado correctamente"
    });
  });

  it("Debería retornar 400 si faltan campos", async () => {
    await UsersController.register(emptyBodyReq, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Todos los campos son obligatorios"
    });
  });

  it("Debería retornar 400 si el usuario ya existe", async () => {
    User.findOne.mockResolvedValue({ email: "test@test.com" });

    await UsersController.register(reqMock, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Usuario ya registrado"
    });
  });
});

describe("UsersController - login", () => {
  it("Debería retornar 200 y un token si las credenciales son correctas", async () => {
    const fakeUser = {
      _id: "123",
      name: "Test User",
      email: "test@test.com",
      role: "user",
      comparePassword: jest.fn().mockResolvedValue(true)
    };

    User.findOne.mockResolvedValue(fakeUser);

    await UsersController.login({ body: { email: "test@test.com", password: "123456" } }, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
    expect(fakeUser.comparePassword).toHaveBeenCalledWith("123456");
    expect(getToken).toHaveBeenCalledWith(fakeUser);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      token: "fake-jwt-token"
    }));
  });

  it("Debería retornar 404 si el usuario no existe", async () => {
    User.findOne.mockResolvedValue(null);

    await UsersController.login({ body: { email: "notfound@test.com", password: "123" } }, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Usuario no encontrado"
    });
  });

  it("Debería retornar 401 si la contraseña es incorrecta", async () => {
    const fakeUser = {
      comparePassword: jest.fn().mockResolvedValue(false)
    };
    User.findOne.mockResolvedValue(fakeUser);

    await UsersController.login({ body: { email: "test@test.com", password: "wrong" } }, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Contraseña incorrecta"
    });
  });
});
