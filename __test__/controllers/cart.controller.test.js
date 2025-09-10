import { afterEach, beforeAll, describe, expect, it, jest } from "@jest/globals";

//  Mock de Cart y Product models
const saveMock = jest.fn();
const deleteOneMock = jest.fn();

jest.unstable_mockModule("../../src/models/cart.js", () => {
  const CartMock = jest.fn(function (data) {
    return { ...data, save: saveMock, deleteOne: deleteOneMock };
  });
  CartMock.find = jest.fn(() => ({ populate: jest.fn() }));
  CartMock.findById = jest.fn();
  return { default: CartMock };
});

jest.unstable_mockModule("../../src/models/products.js", () => {
  return { default: {} };
});

// Importar controlador y modelos con mocks aplicados
const cartController = (await import("../../src/controllers/cart.js")).default;
const Cart = (await import("../../src/models/cart.js")).default;

let res, reqMock, userReqMock;
beforeAll(() => {
  reqMock = {
    body: { id_product: "507f1f77bcf86cd799439011" },
    user: { id: "user123" },
    params: { id_cart: "cart123" },
  };

  userReqMock = {
    user: { id: "user123" },
    params: { id_cart: "cart123" },
    body: { quantity: 2 },
  };

  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

/* ==========================================================
   CREATE (Agregar producto al carrito)
   ========================================================== */
describe("cartController - addToCart", () => {
  it(" Debería agregar un producto al carrito", async () => {
    saveMock.mockResolvedValue({ _id: "cart123", id_product: reqMock.body.id_product });

    await cartController.addToCart(reqMock, res);

    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Producto agregado al carrito" }));
  });

  it(" Debería retornar 400 si falta id_product", async () => {
    await cartController.addToCart({ body: {}, user: { id: "user123" } }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "id_product es requerido" }));
  });
});

/* ==========================================================
   READ (Obtener productos del carrito)
   ========================================================== */
describe("cartController - getCart", () => {
  it(" Debería retornar productos del carrito", async () => {
    const mockCart = [{ id_product: { name: "Laptop", price: 1000 }, quantity: 1 }];
    Cart.find.mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(mockCart) });

    await cartController.getCart(reqMock, res);

    expect(Cart.find).toHaveBeenCalledWith({ id_user: "user123" });
    expect(res.json).toHaveBeenCalledWith(mockCart);
  });
});

/* ==========================================================
   READ EXTRA (Calcular total del carrito)
   ========================================================== */
describe("cartController - getTotal", () => {
  it(" Debería calcular el total del carrito", async () => {
    const mockCartItems = [
      { id_product: { price: 100 }, quantity: 2 },
      { id_product: { price: 50 }, quantity: 1 },
    ];
    Cart.find.mockReturnValueOnce({ populate: jest.fn().mockResolvedValue(mockCartItems) });

    await cartController.getTotal(reqMock, res);

    expect(res.json).toHaveBeenCalledWith({ total: 250 });
  });
});

/* ==========================================================
   UPDATE (Modificar cantidad de un producto en el carrito)
   ========================================================== */
describe("cartController - updateQuantity", () => {
  it(" Debería actualizar la cantidad de un producto", async () => {
    const mockItem = { id_user: "user123", quantity: 1, save: saveMock };
    Cart.findById.mockResolvedValue(mockItem);

    await cartController.updateQuantity(userReqMock, res);

    expect(Cart.findById).toHaveBeenCalledWith("cart123");
    expect(saveMock).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Cantidad actualizada" }));
  });

  it(" Debería retornar 400 si cantidad es inválida", async () => {
    const badReq = { ...userReqMock, body: { quantity: 0 } };

    await cartController.updateQuantity(badReq, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Cantidad inválida" });
  });

  it(" Debería retornar 404 si el item no existe", async () => {
    Cart.findById.mockResolvedValue(null);

    await cartController.updateQuantity(userReqMock, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Item no encontrado" });
  });
});

/* ==========================================================
   DELETE (Quitar producto del carrito)
   ========================================================== */
describe("cartController - removeFromCart", () => {
  it(" Debería eliminar un producto del carrito", async () => {
    const mockItem = { id_user: "user123", deleteOne: deleteOneMock };
    Cart.findById.mockResolvedValue(mockItem);

    await cartController.removeFromCart(userReqMock, res);

    expect(Cart.findById).toHaveBeenCalledWith("cart123");
    expect(deleteOneMock).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: "Producto eliminado del carrito." });
  });

  it(" Debería retornar 404 si el producto no está en el carrito", async () => {
    Cart.findById.mockResolvedValue(null);

    await cartController.removeFromCart(userReqMock, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Producto no encontrado en tu carrito." });
  });
});
