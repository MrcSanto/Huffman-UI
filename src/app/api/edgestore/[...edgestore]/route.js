import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';

const es = initEdgeStore.create();

/**
 * Este é o roteador principal para os buckets do EdgeStore.
 */
const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket({
      accept: ['text/plain'],
      maxSize: 1024 * 1024 * 10, // 10 MiB
  })
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

export { handler as GET, handler as POST };

export {edgeStoreRouter};
