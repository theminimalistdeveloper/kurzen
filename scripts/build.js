require('esbuild')
  .build({
    entryPoints: ['./src/lambdas/redirect.ts'],
    bundle: true,
    outdir: './dist/',
  })
  .catch(() => process.exit(1))
