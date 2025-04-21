import {defineConfig} from "vite"
import {resolve} from "path"
import dtsPlugin from "vite-plugin-dts"

export default defineConfig({
    build: {
        lib: {
            name: "PiParser",
            fileName: "piparser",
            entry: resolve(__dirname, "src/index.ts"),
            formats: ["es"],
        },
        sourcemap: true,
        emptyOutDir: true,
    },
    plugins: [
        dtsPlugin({
            include: ['lib', "es2022"],
            outDir: "dist",
        }), // generate .d.ts files for the lib folder
    ]
})