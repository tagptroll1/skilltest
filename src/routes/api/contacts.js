import * as api from "api";
import routes from "routes";

export async function get(req, res, next) {

    const response = await api.get({
        path: routes.test.biz.contacts + "?expand=Info,Info.DefaultEmail,Info.DefaultPhone",
        token: req.session.access_token,
        headers: {
            "Content-Type": "application/json",
            "CompanyKey": req.query.companyKey
        },
    });

    res.setHeader("Content-Type", "application/json");

    if (!response.ok) {
        res.writeHead(response.status)
        return res.end(JSON.stringify(response.message));
    }

    req.session.currentCompany = req.query.companyKey;

    res.end(JSON.stringify(response.message));
}

export async function post(req, res, next) {
    const { body } = req;

    const response = await api.post({
        body,
        path: routes.test.biz.contacts,
        token: req.session.access_token,
        headers: {
            "Content-Type": "application/json",
            "CompanyKey": req.query.companyKey
        },
    });

    res.setHeader("Content-Type", "application/json");
    res.writeHead(response.status);
    res.end(JSON.stringify(response.message || { ok: response.ok }));
}