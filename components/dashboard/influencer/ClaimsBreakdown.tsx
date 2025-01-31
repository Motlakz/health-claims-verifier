import { AlertTriangle, Check, X } from "lucide-react";
import MetricItem from "./MetricItem";

interface ClaimsBreakdownProps {
    verified: number;
    questionable: number;
    debunked: number;
    total: number;
}

const ClaimsBreakdown = ({ verified, questionable, debunked, total }: ClaimsBreakdownProps) => (
    <div className="border rounded p-2 shadow">
        <h4 className="font-medium mb-4">Claims Breakdown</h4>
        <div className="space-y-3">
            <div className="flex justify-between">
                <span>Total Claims:</span>
                <span>{total}</span>
            </div>
            <MetricItem icon={<Check className="h-4 w-4 text-green-500" />} label="Verified" value={verified} />
            <MetricItem icon={<AlertTriangle className="h-4 w-4 text-yellow-500" />} label="Questionable" value={questionable} />
            <MetricItem icon={<X className="h-4 w-4 text-red-500" />} label="Debunked" value={debunked} />
        </div>
    </div>
);

export default ClaimsBreakdown;
