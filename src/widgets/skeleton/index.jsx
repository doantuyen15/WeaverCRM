import { Skeleton } from "@mui/material"

const DefaultSkeleton = () => {
    return (
        <div className="grid grid-row-3 gap-1">
            <Skeleton variant="rounded" width={260} height={10} />
            <Skeleton variant="rounded" width={260} height={20} />
            <Skeleton variant="rounded" width={260} height={20} />
        </div>
    )
}

export const TableSkeleton = () => {
    return (
        <div className="grid grid-row-3 gap-1 w-full">
            <Skeleton variant="rounded" height={10} />
            <Skeleton variant="rounded" height={20} />
            <Skeleton variant="rounded" height={20} />
        </div>
    )
}

export default DefaultSkeleton;