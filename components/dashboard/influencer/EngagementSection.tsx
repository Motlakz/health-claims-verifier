/* eslint-disable @typescript-eslint/no-explicit-any */
import { Clock, Eye, Heart, MessageSquare, Share } from "lucide-react"
import MetricItem from "./MetricItem"

const EngagementSection = ({ likes, comments, shares, avgViews, lastUpload }: any) => (
    <div className="border rounded p-2 shadow">
        <h4 className="font-medium mb-4">Engagement Metrics</h4>
        <div className="space-y-3">
            <MetricItem icon={<Heart className="h-4 w-4 text-red-400" />} label="Likes" value={new Intl.NumberFormat().format(likes)} />
            <MetricItem icon={<MessageSquare className="h-4 w-4 text-blue-500" />} label="Comments" value={new Intl.NumberFormat().format(comments)} />
            <MetricItem icon={<Share className="h-4 w-4 text-violet-500" />} label="Shares" value={new Intl.NumberFormat().format(shares)} />
            <MetricItem icon={<Eye className="h-4 w-4 text-pink-400" />} label="Avg. Views" value={new Intl.NumberFormat().format(avgViews)} />
            <MetricItem icon={<Clock className="h-4 w-4 text-orange-400" />} label="Last Upload" value={new Date(lastUpload).toLocaleDateString()} />
        </div>
    </div>
)

export default EngagementSection