const usuariosService = require('../services/usuarios_service');

class UsuariosController {

  async getAll(req, res, next) {
    try {
      const users = await usuariosService.getAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await usuariosService.getById(parseInt(req.params.id));
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const user = await usuariosService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const user = await usuariosService.update(
        parseInt(req.params.id),
        req.body
      );
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await usuariosService.delete(parseInt(req.params.id));
      res.json({ message: 'Usuario eliminado' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UsuariosController();