import { useSession } from "next-auth/react";

export function useFeeStatus() {
    const { status } = useSession();
    const isLoading = status === "loading";

    // TODO: Implement actual fee status check using Prisma/API
    // For now, assume no overdue fees to allow migration
    const isOverdue = false;

    return {
        isOverdue: isOverdue,
        isLoading: isLoading,
    };
}
