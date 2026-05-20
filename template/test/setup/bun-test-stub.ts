// Stub for bun:test — @nuxt/test-utils v4 imports this at runtime in Bun-only code paths.
// Vite fails to bundle it in non-Bun environments (https://github.com/nuxt/test-utils/issues/1490).
// This alias intercepts the import so Vite has something to resolve.
export default {};
