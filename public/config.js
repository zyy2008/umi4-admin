const http = "http://192.169.7.200:8070";

const apps = [
  {
    name: "knowledge",
    entry: "//192.169.7.200:8091",
  },
  {
    name: "task",
    entry: "//192.169.7.200:8092",
  },
  {
    name: "arithmetic",
    entry: "//192.169.7.200:8093",
  },
  {
    name: "system",
    entry: "//192.169.7.200:18090",
  },
];

window.config = {
  http,
  apps,
};
