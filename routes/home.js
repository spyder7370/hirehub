const express       = require('express'),
      homeC 	  = require("../controllers/home")
      isAuth        = require('../controllers/authMiddlewares').isAuth,
      router        = express.Router(),

router.get("/home", isAuth, homeC.homeGet);

module.exports = router;