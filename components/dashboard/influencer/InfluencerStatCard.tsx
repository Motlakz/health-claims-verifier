import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { cn } from "@/lib/utils";

interface InfluencerStatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    trend?: "up" | "down";
    colorClass?: string;
}

export default function InfluencerStatCard({ 
    title, 
    value, 
    subtitle, 
    icon, 
    trend, 
    colorClass 
}: InfluencerStatCardProps) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{title}</div>
                    {trend && (
                        trend === "up" ? 
                        <ArrowUpRight className="h-4 w-4 text-green-500" /> : 
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    {!trend && icon}
                </div>
                <div className={cn("text-2xl font-bold", colorClass)}>{value}</div>
                {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
            </CardContent>
        </Card>
    );
}
