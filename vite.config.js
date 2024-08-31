import { defineConfig } from "vite"
import { resolve } from "path";
import dtsPlugin from "vite-plugin-dts";

export default defineConfig({
    build: {
        lib: {
            name: "PiParser",
            fileName: "piparser",
            entry: resolve(__dirname, "src/index.ts"),
            formats: ["es"],
        },
    },
    plugins: [
        dtsPlugin({
            beforeWriteFile: (filePath, content) => (
                {
                    filePath: filePath.replace("index.d.ts", "piparser.d.ts"),
                    content,
                }),
            include: ['lib', "es2022"]
        }), // generate .d.ts files for the lib folder
    ]
})