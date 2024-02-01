const PROXY_CONFIG = [
  {
    context: [
      "/export"
    ],
    target: "https://localhost:7030",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
