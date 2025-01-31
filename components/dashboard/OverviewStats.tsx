import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Activity, Users, FileCheck, AlertTriangle } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string;
    description: string;
    icon: React.ReactNode;
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
    );
}

interface OverviewStatsProps {
    totalInfluencers: number;
    totalClaims: number;
    verifiedClaims: number;
    disputedClaims: number;
    verificationRate: string;
    disputeRate: string;
  }
  
  export function OverviewStats({
    totalInfluencers,
    totalClaims,
    verifiedClaims,
    disputedClaims,
    verificationRate,
    disputeRate,
  }: OverviewStatsProps) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Influencers"
          value={totalInfluencers.toLocaleString()}
          description={`${totalInfluencers} from last month`}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Active Claims"
          value={totalClaims.toLocaleString()}
          description={`${totalClaims} new claims this week`}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Verified Claims"
          value={verifiedClaims.toLocaleString()}
          description={`${verificationRate}% verification rate`}
          icon={<FileCheck className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Disputed Claims"
          value={disputedClaims.toLocaleString()}
          description={`${disputeRate}% dispute rate`}
          icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
    );
  }

export default OverviewStats;
