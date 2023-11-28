# Server

Those are files used on the server-side only.
It is safe to call NodeJS functions, do file operations and work with secrets env variables here.

The frontend can call some functions using a very specific protocol, the [Server Actions](https://makerkit.dev/blog/tutorials/nextjs-server-actions).

Those functions are currently in `/src/app/server/actions`.

