const express = require('express');
const router = express.Router();
const rolesControllers = require('../controllers/roles_controller');

router.get('/', rolesControllers.getRoles);
router.get('/:id', rolesControllers.getRolById);
router.post('/', rolesControllers.createRol);
router.put('/:id', rolesControllers.updateRol);
router.delete('/:id', rolesControllers.deleteRol);

module.exports = router;