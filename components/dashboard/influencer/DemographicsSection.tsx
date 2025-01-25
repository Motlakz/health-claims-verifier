import { Separator } from "@/components/ui/separator";
import { Demographics } from "@/types";

interface DemographicsSectionProps {
    demographics: Demographics;
}

export default function DemographicsSection({ demographics }: DemographicsSectionProps) {
    return (
        <div>
            <h4 className="font-medium mb-4">Audience Demographics</h4>
            <div className="grid grid-cols-2 gap-4">
                <div className="border shadow p-2 rounded">
                    <h5 className="text-sm font-medium mb-2">Gender</h5>
                    <Separator />
                    {Object.entries(demographics.gender).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                            <span>{key}:</span>
                            <span>{value}%</span>
                        </div>
                    ))}
                </div>
                <div className="border shadow p-2 rounded">
                    <h5 className="text-sm font-medium mb-2">Age Groups</h5>
                    <Separator />
                    {Object.entries(demographics.age).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                            <span>{key}:</span>
                            <span>{value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}