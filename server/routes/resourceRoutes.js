/* 
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  listResource,
  getResource,
  createResource,
  updateResource,
  deleteResource
} = require("../controllers/resourceController");

router.use(authMiddleware);

router.get("/:resource", listResource);
router.get("/:resource/:id", getResource);
router.post("/:resource", createResource);
router.put("/:resource/:id", updateResource);
router.delete("/:resource/:id", deleteResource);

module.exports = router;
 */

const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  listResource,
  getResource,
  createResource,
  updateResource,
  deleteResource
} = require("../controllers/resourceController");

router.use(auth);

const resources = [
  "products",
  "categories",
  "customers",
  "suppliers",
  "expenses"
];

resources.forEach(resource => {
  router.get(`/${resource}`, (req, res, next) => {
    req.params.resource = resource;
    listResource(req, res, next);
  });

  router.get(`/${resource}/:id`, (req, res, next) => {
    req.params.resource = resource;
    getResource(req, res, next);
  });

  router.post(`/${resource}`, (req, res, next) => {
    req.params.resource = resource;
    createResource(req, res, next);
  });

  router.put(`/${resource}/:id`, (req, res, next) => {
    req.params.resource = resource;
    updateResource(req, res, next);
  });

  router.delete(`/${resource}/:id`, (req, res, next) => {
    req.params.resource = resource;
    deleteResource(req, res, next);
  });
});

module.exports = router;
