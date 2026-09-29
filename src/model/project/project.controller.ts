import {
  CreateProjectDTO,
  ProjectDTO,
  UpdateProjectDTO,
} from "@/interface/project.dto.js";

import { asyncHandler } from "@/lib/asyncHandler.js";
import { ApiResponse } from "@/util/api.js";
import { ProjectService } from "./project.service.js";

export class ProjectController {
  constructor(private projectService: ProjectService) {}
  readonly createProject = asyncHandler(async (req, res) => {
    const data: CreateProjectDTO = req.body;
    const project = await this.projectService.create(data, req);
    res
      .status(201)
      .json(new ApiResponse(201, "Project created successfully", project));
  });

  readonly listProjects = asyncHandler(async (req, res) => {
    const projects = await this.projectService.list();
    res
      .status(200)
      .json(new ApiResponse(200, "Projects fetched successfully", projects));
  });
  readonly listPublishedProjects = asyncHandler(async (req, res) => {
    const projects = await this.projectService.listPublished();
    res
      .status(200)
      .json(new ApiResponse(200, "Published projects fetched successfully", projects));
  });
  readonly getProject = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const project = await this.projectService.getProject(id as string);
    res
      .status(200)
      .json(new ApiResponse(200, "Project fetched successfully", project));
  });
  readonly getProjectBySlug = asyncHandler(async (req, res) => {
    const slug = req.params.slug;
    const project = await this.projectService.getProjectBySlug(slug as string);
    res
      .status(200)
      .json(new ApiResponse(200, "Project fetched successfully", project));
  });
  readonly updateProject = asyncHandler(async (req, res) => {
    const data: UpdateProjectDTO = req.body;
    const id = req.params.id;
    const project = await this.projectService.update(id as string, data);
    res
      .status(200)
      .json(new ApiResponse(200, "Project updated successfully", project));
  });

  readonly deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const project = await this.projectService.delete(id as string);
    res
      .status(200)
      .json(new ApiResponse(200, "Project deleted successfully", project));
  });

  readonly deleteAll = asyncHandler(async (req, res) => {
    await this.projectService.deleteAll();
    res
      .status(204)
      .json(new ApiResponse(204, "All projects deleted successfully", null));
  });
}
