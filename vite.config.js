/** @type {import('vite').UserConfig} */
import { resolve } from "path";
import dtsPlugin from "vite-plugin-dts";

export default {
    build: {
        outDir: "dist",
        copyPublicDir: false,
        lib: {
            entry: resolve(__dirname, "lib/index.ts"),
            name: "PiParser",
            formats: ["es"],
            fileName: "piparser"
        },
        emptyOutDir: true,
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
}