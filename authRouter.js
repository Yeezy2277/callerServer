const Router = require('express');
const router = new Router();
const controller = require('./authController');
const authMiddleware = require('./middleware/authMiddleware');

router.post('/login', controller.login);
router.post('/code', controller.code);
router.post('/userProfile', authMiddleware, controller.userProfile);
router.post('/users', authMiddleware, controller.users);
router.get('/incomingState', authMiddleware, controller.getIncomingState);
router.post('/incomingState', authMiddleware, controller.setIncomingState);

module.exports = router;
