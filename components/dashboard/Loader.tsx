import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Loader } from 'lucide-react'

export const DataLoader = () => {
    return (
        <Card className="relative overflow-hidden">
        <CardHeader>
            <div className="flex items-center space-x-4">
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between py-2">
                <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                </div>
                <div className="flex items-center space-x-3">
                    <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
                    <div className="h-6 w-12 bg-muted animate-pulse rounded-full" />
                </div>
                </div>
            ))}
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Loader className="h-6 w-6 animate-spin" />
                <span className="text-sm font-medium">Loading data...</span>
            </div>
            </div>
        </CardContent>
        </Card>
    )
}
