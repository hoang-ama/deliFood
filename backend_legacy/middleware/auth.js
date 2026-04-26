import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({success:false,message:'Not Authorized Login Again'});
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        const userId = tokenDecode.userId || tokenDecode.id;

        req.user = {
            userId,
            tenantId: tokenDecode.tenantId,
            role: tokenDecode.role
        };

        if (req.tenantId && tokenDecode.tenantId && req.tenantId !== tokenDecode.tenantId) {
            return res.json({ success: false, message: "Invalid tenant context" });
        }

        req.body.userId = userId;
        next();
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}

export default authMiddleware;