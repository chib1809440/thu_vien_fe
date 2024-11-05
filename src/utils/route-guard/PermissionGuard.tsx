import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/JWTContext';

const PermissionGuard = ({ children, requiredPermissions }) => {
    const { user } = useAuth();
    const dataUser = useMemo(() => {
        if (!user) return null;

        const _user = { ...user } as any;

        return _user;
    }, [user]);
    console.log('dsds', dataUser);

    // Kiểm tra quyền truy cập
    const hasPermission = requiredPermissions.some(permission =>
        dataUser.data.roleId.permissions.some(
            userPermission =>
                userPermission.resource === permission.resource &&
                userPermission.action === permission.action
        )
    );

    console.log("hasPermission", requiredPermissions);
    console.log("permissions",  dataUser.data.roleId.permissions);

    

    if (!hasPermission) {
        return <Navigate to="/403" />;
    }

    return children;
};

export default PermissionGuard;
