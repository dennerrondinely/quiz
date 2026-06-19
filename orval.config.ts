import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: './openapi.yaml',
    },
    output: {
      mode: 'tags-split',
      target: './src/shared/api/generated',
      schemas: './src/shared/api/generated/schemas',
      client: 'react-query',
      httpClient: 'axios',
      clean: true,
      prettier: false,
      biome: true,
      override: {
        mutator: {
          path: './src/shared/api/mutator.ts',
          name: 'customAxios',
        },
        query: {
          useQuery: true,
          useSuspenseQuery: true,
          useInfinite: false,
          options: {
            staleTime: 30_000,
          },
        },
      },
    },
  },
  apiZod: {
    input: {
      target: './openapi.yaml',
    },
    output: {
      mode: 'tags-split',
      client: 'zod',
      target: './src/shared/api/generated/zod',
      fileExtension: '.zod.ts',
      clean: true,
      prettier: false,
      biome: true,
    },
  },
});
