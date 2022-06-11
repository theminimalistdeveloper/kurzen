require('esbuild')
  .build({
    entryPoints: ['./src/lambdas/redirect/redirect.ts'],
    bundle: true,
    minify: true,
    outdir: './dist/',
    platform: 'node',
    sourcemap: true,
    treeShaking: true,
    outbase: 'src',
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
