import { defineConfig } from "vite";

export default defineConfig({
    root: ".", // Set the root directory (default is the current directory)
    build: {
        rollupOptions: {
            input: {
                main: "./demo.html", // Path to your custom HTML file
            },
        },
    },
});
