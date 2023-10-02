import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(3).max(100),
  units: z.array(z.string().max(100)),
});

export type createCourseType = z.infer<typeof createCourseSchema>;
