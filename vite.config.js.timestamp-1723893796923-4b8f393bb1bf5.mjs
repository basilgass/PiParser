// vite.config.js
import { resolve } from "path";
import dtsPlugin from "file:///C:/websites/PiParser/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\websites\\PiParser";
var vite_config_default = {
  build: {
    outDir: "dist",
    copyPublicDir: false,
    lib: {
      entry: resolve(__vite_injected_original_dirname, "lib/index.ts"),
      name: "PiParser",
      formats: ["es"],
      fileName: "piparser"
    },
    emptyOutDir: true
  },
  plugins: [
    dtsPlugin({
      beforeWriteFile: (filePath, content) => ({
        filePath: filePath.replace("index.d.ts", "piparser.d.ts"),
        content
      }),
      include: ["lib", "es2022"]
    })
    // generate .d.ts files for the lib folder
  ]
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFx3ZWJzaXRlc1xcXFxQaVBhcnNlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcd2Vic2l0ZXNcXFxcUGlQYXJzZXJcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L3dlYnNpdGVzL1BpUGFyc2VyL3ZpdGUuY29uZmlnLmpzXCI7LyoqIEB0eXBlIHtpbXBvcnQoJ3ZpdGUnKS5Vc2VyQ29uZmlnfSAqL1xyXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IGR0c1BsdWdpbiBmcm9tIFwidml0ZS1wbHVnaW4tZHRzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgICBidWlsZDoge1xyXG4gICAgICAgIG91dERpcjogXCJkaXN0XCIsXHJcbiAgICAgICAgY29weVB1YmxpY0RpcjogZmFsc2UsXHJcbiAgICAgICAgbGliOiB7XHJcbiAgICAgICAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgXCJsaWIvaW5kZXgudHNcIiksXHJcbiAgICAgICAgICAgIG5hbWU6IFwiUGlQYXJzZXJcIixcclxuICAgICAgICAgICAgZm9ybWF0czogW1wiZXNcIl0sXHJcbiAgICAgICAgICAgIGZpbGVOYW1lOiBcInBpcGFyc2VyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgICBkdHNQbHVnaW4oe1xyXG4gICAgICAgICAgICBiZWZvcmVXcml0ZUZpbGU6IChmaWxlUGF0aCwgY29udGVudCkgPT4gKFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbGVQYXRoOiBmaWxlUGF0aC5yZXBsYWNlKFwiaW5kZXguZC50c1wiLCBcInBpcGFyc2VyLmQudHNcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCxcclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICBpbmNsdWRlOiBbJ2xpYicsIFwiZXMyMDIyXCJdXHJcbiAgICAgICAgfSksIC8vIGdlbmVyYXRlIC5kLnRzIGZpbGVzIGZvciB0aGUgbGliIGZvbGRlclxyXG4gICAgXVxyXG59Il0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsZUFBZTtBQUN4QixPQUFPLGVBQWU7QUFGdEIsSUFBTSxtQ0FBbUM7QUFJekMsSUFBTyxzQkFBUTtBQUFBLEVBQ1gsT0FBTztBQUFBLElBQ0gsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLElBQ2YsS0FBSztBQUFBLE1BQ0QsT0FBTyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUN4QyxNQUFNO0FBQUEsTUFDTixTQUFTLENBQUMsSUFBSTtBQUFBLE1BQ2QsVUFBVTtBQUFBLElBQ2Q7QUFBQSxJQUNBLGFBQWE7QUFBQSxFQUNqQjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsVUFBVTtBQUFBLE1BQ04saUJBQWlCLENBQUMsVUFBVSxhQUN4QjtBQUFBLFFBQ0ksVUFBVSxTQUFTLFFBQVEsY0FBYyxlQUFlO0FBQUEsUUFDeEQ7QUFBQSxNQUNKO0FBQUEsTUFDSixTQUFTLENBQUMsT0FBTyxRQUFRO0FBQUEsSUFDN0IsQ0FBQztBQUFBO0FBQUEsRUFDTDtBQUNKOyIsCiAgIm5hbWVzIjogW10KfQo=
