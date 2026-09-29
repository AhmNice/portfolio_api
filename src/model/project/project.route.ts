import { restrictTo } from "@/middleware/authorization.js";
import { ProjectController } from "./project.controller.js";
import { Router } from "express";
import { protect } from "@/middleware/authentication.js";
import {
  createProjectSchema,
  getProjectBySlugSchema,
  getProjectSchema,
} from "@/schema/project.schema.js";
import { validate } from "@/middleware/validation.js";
import projectService from "./project.service.js";
import { upload } from "@/config/multer.js";

const projectRouter = Router();
const projectController = new ProjectController(projectService);

projectRouter.get("/", projectController.listProjects);
projectRouter.get("/published", projectController.listPublishedProjects);
projectRouter.get(
  "/:id",
  validate(getProjectSchema),
  projectController.getProject,
);
projectRouter.get(
  "/slug/:slug",
  validate(getProjectBySlugSchema),
  projectController.getProjectBySlug,
);

// projectRouter.use(protect, restrictTo(["ADMIN", "SYSTEM_ADMIN"]));
projectRouter.post(
  "/",
  upload.single("content"),
  validate(createProjectSchema),
  projectController.createProject,
);
projectRouter.patch(
  "/:id",
  upload.single("content"),
  validate(getProjectSchema),
  projectController.updateProject,
);
projectRouter.delete(
  "/:id",
  validate(getProjectSchema),
  projectController.deleteProject,
);
projectRouter.delete("/", projectController.deleteAll);
export default projectRouter;
