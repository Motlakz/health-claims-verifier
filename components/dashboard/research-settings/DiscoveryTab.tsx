"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function DiscoverNewTab() {
    const [tasks, setTasks] = useState(new Set([
        'Identify known health influencers',
        'Find and analyze new health influencers'
    ]))
    const [timeRange, setTimeRange] = useState('last-month')
    const [productsCount, setProductsCount] = useState(10)

    const handleTaskSelect = (task: string) => {
        setTasks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(task)) {
                newSet.delete(task);
            } else {
                newSet.add(task);
            }
            return newSet;
        });
    };

    const handleSubmit = () => {
        const config = {
            tasks: Array.from(tasks),
            timeRange,
            productsCount
        }
        console.log('Discovery Configuration:', config)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Discovery Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                <Label>Research Tasks *</Label>
                <div className="space-y-2">
                    {[
                    'Identify known health influencers',
                    'Find and analyze new health influencers',
                    'Analyze monetization methods and estimate earnings',
                    'Cross-reference claims with scientific literature',
                    ].map((task) => (
                    <div key={task} className="flex items-center space-x-2">
                        <Checkbox
                        id={task}
                        checked={tasks.has(task)}
                        onCheckedChange={() => handleTaskSelect(task)}
                        />
                        <Label htmlFor={task}>{task}</Label>
                    </div>
                    ))}
                </div>
                </div>

                <Separator />

                <div className="space-y-2">
                <Label>Additional Settings</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label>Time Range</Label>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger>
                        <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                        <SelectContent>
                        {['Last Week', 'Last Month', 'Last Year', 'All Time'].map((option) => (
                            <SelectItem 
                            key={option}
                            value={option.toLowerCase().replace(' ', '-')}
                            >
                            {option}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>

                    <div className="space-y-2">
                    <Label>Products per Influencer</Label>
                    <Input
                        type="number"
                        min="0"
                        value={productsCount}
                        onChange={(e) => setProductsCount(Number(e.target.value))}
                    />
                    </div>
                </div>
                </div>

                <Button 
                className="w-full md:w-auto"
                onClick={handleSubmit}
                disabled={tasks.size === 0}
                >
                + Start Discovery
                </Button>
            </CardContent>
        </Card>
    )
}
