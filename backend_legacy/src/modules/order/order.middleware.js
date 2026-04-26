const tenantMiddleware = (req, res, next) => {
    const tenantId =
        req.headers["x-tenant-id"] ||
        req.headers.tenantid ||
        req.body.tenantId ||
        req.query.tenantId;

    if (!tenantId) {
        return res.json({ success: false, message: "tenantId is required" });
    }

    req.tenantId = String(tenantId);
    next();
};

const authorizeRoles = (allowedRoles) => (req, res, next) => {
    const role = req.user?.role;

    if (!role || !allowedRoles.includes(role)) {
        return res.json({ success: false, message: "Forbidden" });
    }

    next();
};

export { tenantMiddleware, authorizeRoles };
