import { Permission } from "../interfaces/role";

// Check access permissions based on user roles
export const hasPermission = (
    requiredPermissions: Permission[] = [],
    userPermissions: Permission[] = [] // Set default value to an empty array
) => {
    // Check if userPermissions is valid before using .some()
    if (!userPermissions) {
        console.error("User permissions are not defined");
        return false; // Return false or handle as needed
    }

    return requiredPermissions.length === 0 || // Allow if no specific permissions are required
        requiredPermissions.some(permission =>
            userPermissions.some(
                userPermission =>
                    userPermission.resource === permission.resource &&
                    userPermission.action === permission.action
            )
        );
};
