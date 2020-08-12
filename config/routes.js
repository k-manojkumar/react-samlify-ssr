const path = require("path");

import template from "../src/template";
import ssr from "../src/server";

module.exports = function (app) {
  /*app.get('/home', function (req, res) {
        console.log(JSON.stringify(extract))
        if (true) {
          console.log(" Root Path ----   Authed ::: ")
      
          res.sendFile(path.resolve('build/index.html'));
        } else {
          console.log(" Root Path ----   not Authed ::: ")
          res.redirect('/login/fail');
        }
      });*/

  let initialState = {
    isAuth: false,
    data: { name: "", id: "" },
  };

  app.get("/login", async (req, res) => {
    const { id, context: redirectUrl } = await req.sp.createLoginRequest(
      req.idp,
      "redirect"
    );
    return res.redirect(redirectUrl);
  });

  app.post("/login/callback", async (req, res) => {
    try {
      const { extract } = await req.sp.parseLoginResponse(req.idp, "post", req);
      const { givenname, surname } = extract.attributes;

      console.log("extract details--> " + JSON.stringify(extract));
      console.log(givenname);
      console.log(surname);

      if (givenname) {
        return res.sendFile(path.resolve("build/index.html"));
      }

      throw new Error("ERR_USER_NOT_FOUND");
    } catch (e) {
      console.error("[FATAL] when parsing login response", e);
      return res.redirect("/login/fail");
    }
  });

  app.get("/login/fail", function (req, res) {
    console.log("ReQ--- Fail----");
    res.status(401).send("Login failed");
  });

  app.post("/sp/acs", async (req, res) => {
    try {
      const { extract } = await req.sp.parseLoginResponse(req.idp, "post", req);
      const { mail, name } = extract.attributes;

      initialState = {
        isAuth: false,
        data: { name: name, id: mail },
      };

      console.log("extract details--> " + JSON.stringify(extract));
      console.log(mail);
      console.log(name);

      if (mail) {
        return res.redirect("/");
      }

      throw new Error("ERR_USER_NOT_FOUND");
    } catch (e) {
      console.error("[FATAL] when parsing login response", e);
      return res.redirect("/");
    }
  });

  // server rendered home page
  app.get("/", (req, res) => {
    const { preloadedState, content } = ssr(initialState);
    const response = template("Server Rendered Page", preloadedState, content);
    res.setHeader("Cache-Control", "assets, max-age=604800");
    res.send(response);
  });
};
