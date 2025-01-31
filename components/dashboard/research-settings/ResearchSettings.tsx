/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ResearchTasksTab from './ResearchTasks'
import SpecificInfluencerTab from './InfluencerResearch'
import DiscoverNewTab from './DiscoveryTab'
import { AlertCircle, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function ResearchSettings() {
    const [activeTab, setActiveTab] = useState<'specific' | 'discover' | 'tasks'>('specific')

    return (
        <div className="grid min-h-screen w-full">
            <div className="flex flex-col p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold">Research Configuration</h1>
                        <span className="text-orange-600 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            (Currently static since most of the logic is rotated within the APIs via multi-modal approach)
                        </span>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/">Sign Out <LogOut className="w-5 h-5" /></Link>
                    </Button>
                </div>

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-[600px] mb-8">
                    <TabsTrigger value="specific">Specific Influencer</TabsTrigger>
                    <TabsTrigger value="discover">Discover New</TabsTrigger>
                    <TabsTrigger value="tasks">Research Tasks</TabsTrigger>
                </TabsList>

                <TabsContent value="specific">
                    <SpecificInfluencerTab />
                </TabsContent>

                <TabsContent value="discover">
                    <DiscoverNewTab />
                </TabsContent>

                <TabsContent value="tasks">
                    <ResearchTasksTab />
                </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
