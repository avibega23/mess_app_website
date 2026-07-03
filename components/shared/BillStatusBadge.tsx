import { Badge } from "@/components/ui/badge"
import { Bill } from "@/types/bills/bill.types"

export function BillStatusBadge({
    bill,
}: {
    bill: Pick<Bill, "status" | "generated"> & Pick<Partial<Bill>, "carriedForward">
}) {
    if (!bill.generated) {
        return <Badge variant="outline">Not generated</Badge>
    }
    if (bill.carriedForward && bill.status !== "PAID") {
        return <Badge variant="outline">Carried forward</Badge>
    }
    if (bill.status === "PAID") {
        return (
            <Badge className="border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Paid
            </Badge>
        )
    }
    if (bill.status === "PARTIAL") {
        return (
            <Badge className="border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Partial
            </Badge>
        )
    }
    return <Badge variant="destructive">Unpaid</Badge>
}
