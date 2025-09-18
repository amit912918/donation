// // server.ts
// import cluster from "cluster";
// import os from "os";
// import app from "./index";

// const PORT: number = parseInt(process.env.PORT || "9000", 10);

// if (cluster.isPrimary) {
//   const numCPUs = os.cpus().length;
//   console.log(`Primary process ${process.pid} is running`);
//   console.log(`Starting ${numCPUs} workers...`);

//   // Fork workers
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died. Starting a new one...`);
//     cluster.fork();
//   });

// } else {
//   app.listen(PORT, () => {
//     console.log(`Worker ${process.pid} started at http://localhost:${PORT}`);
//   });
// }
