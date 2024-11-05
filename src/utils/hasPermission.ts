import { useMemo } from "react";
import { useAuth } from "../contexts/JWTContext";
import { User } from "../interfaces/user";
import { Role } from "../interfaces/role";

const usePermission = () => {
    const { user } = useAuth();
    const dataUser = useMemo(() => {
        if (!user) return null;
        const _user = { ...user } as any;
        return _user?.data as User;
    }, [user]);

    const hasPermission = useMemo(() => {
        return (allowPermissions: { resource: string; action: string }[]) => {
            if (!dataUser) return false;

            const isValid = allowPermissions?.some((permission) => {
                return (dataUser?.roleId as Role)?.permissions.some(
                    (userPermission) =>
                        userPermission.resource === permission.resource &&
                        userPermission.action === permission.action
                );
            });

            if (!isValid) return false;

            return true;
        };
    }, [dataUser]);

    return { hasPermission };
};

export default usePermission;