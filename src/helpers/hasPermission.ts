import { Permission } from "../interfaces/role";

// Check access permissions based on user roles
export const hasPermission = (
    requiredPermissions: Permission[] = [],
    userPermissions: Permission[]
) => {
    return requiredPermissions.length === 0 || // Allow if no specific permissions are required
        requiredPermissions.some(permission =>
            userPermissions.some(
                userPermission =>
                    userPermission.resource === permission.resource &&
                    userPermission.action === permission.action
            )
        );
};
