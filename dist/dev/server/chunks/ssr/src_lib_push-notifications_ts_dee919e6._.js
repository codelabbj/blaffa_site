module.exports = [
"[project]/src/lib/push-notifications.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/node_modules_4c4ee3d3._.js",
  "server/chunks/ssr/[root-of-the-server]__ae65f3bc._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/lib/push-notifications.ts [app-ssr] (ecmascript)");
    });
});
}),
];