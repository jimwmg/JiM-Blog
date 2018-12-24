---

---

* 避免在生产中使用 `inline-***` 和 `eval-***`，因为它们可以增加 bundle 大小，并降低整体性能。(https://webpack.docschina.org/guides/production/#npm-scripts)
* Dev-tool(https://webpack.docschina.org/configuration/devtool)
* 其中一些值适用于开发环境，一些适用于生产环境。对于开发环境，通常希望更快速的 source map，需要添加到 bundle 中以增加体积为代价，但是对于生产环境，则希望更精准的 source map，需要从 bundle 中分离并独立存在。