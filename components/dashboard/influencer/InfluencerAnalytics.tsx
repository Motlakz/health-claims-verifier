import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from "recharts";
import { TrendingUp, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface InfluencerAnalyticsProps {
  verifiedClaims: number;
  questionableClaims: number;
  debunkedClaims: number;
  totalClaims: number;
  averageTrustScore: number;
}

interface ChartDataItem {
  name: string;
  total: number;
  icon: typeof CheckCircle;
  color: string;
  fillColor: string;
  bgColor: string;
}

const InfluencerAnalytics = ({
  verifiedClaims,
  questionableClaims,
  debunkedClaims,
  totalClaims,
  averageTrustScore
}: InfluencerAnalyticsProps) => {
  const chartData = [
    {
      name: "Verified",
      total: verifiedClaims,
      icon: CheckCircle,
      color: "text-green-600",
      fillColor: "rgb(34, 197, 94)",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      name: "Questionable",
      total: questionableClaims,
      icon: AlertTriangle,
      color: "text-yellow-600",
      fillColor: "rgb(234, 179, 8)",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
    },
    {
      name: "Debunked",
      total: debunkedClaims,
      icon: XCircle,
      color: "text-red-600",
      fillColor: "rgb(239, 68, 68)",
      bgColor: "bg-red-50 dark:bg-red-900/20"
    }
  ];

  // Calculate percentages
  const getPercentage = (value: number) => ((value / totalClaims) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Claims Overview</h2>
          <p className="text-sm text-muted-foreground">
            Analysis based on {totalClaims} total claims
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">{averageTrustScore.toFixed(1)}% Trust Score</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {chartData.map((item) => (
          <Card key={item.name} className="transition-all duration-200 hover:shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-2">
                <item.icon className={`h-8 w-8 ${item.color}`} />
                <div className={`text-2xl font-bold ${item.color}`}>{getPercentage(item.total)}%</div>
                <p className="text-xs text-muted-foreground uppercase">{item.name}</p>
                <p className="text-sm font-medium">{item.total} claims</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#888888" opacity={0.2} />
                <XAxis 
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ChartDataItem;
                      return (
                        <div className={`${data.bgColor} border rounded-lg p-2 shadow-lg`}>
                          <div className="flex items-center gap-2">
                            <data.icon className={`h-4 w-4 ${data.color}`} />
                            <p className="font-medium">{data.name}</p>
                          </div>
                          <p className={`text-sm ${data.color}`}>
                            {data.total} claims ({getPercentage(data.total)}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="total"
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.fillColor}
                      fillOpacity={0.9}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfluencerAnalytics;
