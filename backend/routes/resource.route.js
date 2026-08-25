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
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

 
// Public
 

router.get("/", getResources);
router.get("/:id/document/:docId", getDocument);


 
// Admin
 
router.get(
  "/admin/all",
  authMiddleware,
  authorizeRoles("admin"),
  getAllResourcesAdmin
);


 
// My Resources
 

router.get(
  "/my",
  authMiddleware,
  authorizeRoles("creator", "expert", "admin"),
  getMyResources
);


 
// Resource by ID

 

router.get(
  "/:id",
  authMiddleware,
  getResourceById
);


 
// Create
 

router.post(
  "/",
  authMiddleware,
  authorizeRoles("creator", "expert", "admin"),
  uploadMiddleware.array("documents", 5),
  createResource
);


 
// Update
 

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("creator", "expert", "admin"),
  uploadMiddleware.array("documents", 5),
  updateResource
);


 
// Delete
 

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("creator", "expert", "admin"),
  deleteResource
);


 
// Publish
 

router.patch(
  "/:id/publish",
  authMiddleware,
  authorizeRoles("creator", "expert", "admin"),
  publishResource
);


 
// Archive
 

router.patch(
  "/:id/archive",
  authMiddleware,
  authorizeRoles("creator", "expert", "admin"),
  archiveResource
);

export default router;