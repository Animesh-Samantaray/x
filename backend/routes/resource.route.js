import express from "express";

import {
  createResource,
  getResources,
  getResourceById,
  getMyResources,
  updateResource,
  deleteResource,
  publishResource,
  archiveResource,
  getAllResourcesAdmin,
  getDocument,
} from "../controllers/resource.controller.js";

import uploadMiddleware from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();


router.get("/", getResources);


router.get(
  "/admin/all",
  protect,
  authorizeRoles("admin"),
  getAllResourcesAdmin
);


router.get(
  "/my",
  protect,
  authorizeRoles("creator", "expert", "admin"),
  getMyResources
);

router.get("/:id/document/:docId", getDocument);


router.get("/:id", protect, getResourceById);


router.post(
  "/",
  protect,
  authorizeRoles("creator", "expert", "admin"),
  uploadMiddleware.array("documents", 5),
  createResource
);



router.put(
  "/:id",
  protect,
  authorizeRoles("creator", "expert", "admin"),
  uploadMiddleware.array("documents", 5),
  updateResource
);


router.delete(
  "/:id",
  protect,
  authorizeRoles("creator", "expert", "admin"),
  deleteResource
);


router.patch(
  "/:id/publish",
  protect,
  authorizeRoles("creator", "expert", "admin"),
  publishResource
);


router.patch(
  "/:id/archive",
  protect,
  authorizeRoles("creator", "expert", "admin"),
  archiveResource
);

export default router;