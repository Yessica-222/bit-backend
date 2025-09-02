import User from "../models/users.js";
import { getToken } from "../utils/token.js";

const UsersController = {
  // Registrar usuario
  register: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Todos los campos son obligatorios",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Usuario ya registrado",
        });
      }

      const allowedRoles = ["user", "admin"];
      const roleToSave = allowedRoles.includes(role) ? role : "user";

      const user = new User({ name, email, password, role: roleToSave });
      await user.save();

      res.status(201).json({
        success: true,
        message: "Usuario registrado correctamente",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error del servidor" });
    }
  },

  // Login usuario
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Usuario no encontrado" });
      }

      const validPassword = await user.comparePassword(password);
      if (!validPassword) {
        return res
          .status(401)
          .json({ success: false, message: "Contraseña incorrecta" });
      }

      const token = getToken(user);
      const welcomeMsg =
        user.role === "admin"
          ? `Bienvenido Admin ${user.name}`
          : `Bienvenido ${user.name}`;

      res.status(200).json({
        success: true,
        message: welcomeMsg,
        token,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error del servidor" });
    }
  },

  // Listar usuarios
  list: async (req, res) => {
    try {
      const users = await User.find({}, "name email role");
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al obtener usuarios" });
    }
  },

  // Perfil autenticado
  profile: async (req, res) => {
    try {
      const userId = req.user.id || req.user._id;
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al obtener perfil" });
    }
  },

  // Obtener usuario por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select("-password");
      if (!user) {
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al obtener usuario" });
    }
  },

  // Actualizar perfil
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id || req.user._id;
      const { name, email } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: "Nombre y email son requeridos",
        });
      }

      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({ success: false, message: "Email ya en uso" });
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email },
        { new: true, runValidators: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }

      res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al actualizar perfil" });
    }
  },
};

export default UsersController;
