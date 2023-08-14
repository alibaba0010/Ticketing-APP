import axios from "axios";
export default ({ req }) => {
  if (typeof window === "undefined") {
    console.log("Req: ", req.headers);
    // We are on the server

    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",

      headers: req.headers,
      // headers: {
      //   Host: "http://192.168.49.2:32208",
      // },
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseUrl: "/",
    });
  }
};
