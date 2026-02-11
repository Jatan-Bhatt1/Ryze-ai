import { z } from 'zod';

// Recursive schema for component children
const componentSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  props: z.record(z.any()).optional(),
  children: z.lazy(() => z.union([
    z.string(),
    z.array(componentSchema),
    z.null()
  ])).optional()
});

export const plannerSchema = z.object({
  layout: z.object({
    type: z.string(),
    description: z.string().optional()
  }),
  components: z.array(componentSchema),
  reasoning: z.string().optional()
});
