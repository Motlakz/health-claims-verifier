interface MetricItemProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}

const MetricItem = ({ icon, label, value }: MetricItemProps) => (
    <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
            {icon}
            <span>{label}</span>
        </div>
        <span className="font-medium">{value}</span>
    </div>
);

export default MetricItem;
