import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Activity, Users, FileCheck, AlertTriangle } from "lucide-react"
  
interface StatsCardProps {
    title: string
    value: string
    description: string
    icon: React.ReactNode
}
  
function StatsCard({ title, value, description, icon }: StatsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}
  
export function OverviewStats() {
    return (
        <>
            <StatsCard
                title="Total Influencers"
                value="2,350"
                description="+180 from last month"
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard
                title="Active Claims"
                value="1,234"
                description="+340 new claims this week"
                icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard
                title="Verified Claims"
                value="854"
                description="69% verification rate"
                icon={<FileCheck className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard
                title="Disputed Claims"
                value="145"
                description="12% dispute rate"
                icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
            />
        </>
    )
}
