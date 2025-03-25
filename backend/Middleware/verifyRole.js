const verifyRole = (user, requiredRole) => {
    if (!user) {
        throw new Error("Authentication required");
    }
    if (user.role !== requiredRole) {
        throw new Error(`Access denied! Only ${requiredRole}s can perform this action.`);
    }
};
export default verifyRole;
