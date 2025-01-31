"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'

export default function SpecificInfluencerTab() {
    const [influencerInputType, setInfluencerInputType] = useState<'name' | 'url'>('name')
    const [influencerIdentifier, setInfluencerIdentifier] = useState('')
    const [timeRange, setTimeRange] = useState('last-month')
    const [productsCount, setProductsCount] = useState(10)
    const [notes, setNotes] = useState('')
    const [claimsCount, setClaimsCount] = useState(50)
    const [selectedJournals, setSelectedJournals] = useState<Set<string>>(new Set())
    const [customJournal, setCustomJournal] = useState('')

    const predefinedJournals = [
        'PubMed Central', 'Nature', 'Science', 'Cell', 'The Lancet',
        'New England Journal of Medicine', 'JAMA Network', 'BMJ',
        'PLOS One', 'Frontiers in Nutrition', 'Psychology Today',
        'American Journal of Clinical Nutrition', 'Sleep Medicine Reviews'
    ]

    const handleJournalSelect = (journal: string) => {
        setSelectedJournals(prev => {
        const newSet = new Set(prev);
        if (newSet.has(journal)) {
            newSet.delete(journal);
        } else {
            newSet.add(journal);
        }
        return newSet;
        });
    };

    const addCustomJournal = () => {
        if (customJournal.trim()) {
        setSelectedJournals(prev => new Set(prev).add(customJournal.trim()))
        setCustomJournal('')
        }
    }

    const validateForm = () => {
        return influencerIdentifier.trim() !== '' && 
            claimsCount >= 10 && 
            selectedJournals.size > 0
    }

    const handleSubmitResearch = () => {
        if (!validateForm()) return
        
        const config = {
            identifier: influencerIdentifier,
            identifierType: influencerInputType,
            timeRange,
            productsCount,
            notes,
            claimsCount,
            journals: Array.from(selectedJournals)
        }
        
        console.log('Research Configuration:', config)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Analyze Specific Influencer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                <div className="flex gap-2">
                    <Button
                    variant={influencerInputType === 'name' ? 'default' : 'outline'}
                    onClick={() => setInfluencerInputType('name')}
                    >
                    By Name
                    </Button>
                    <Button
                    variant={influencerInputType === 'url' ? 'default' : 'outline'}
                    onClick={() => setInfluencerInputType('url')}
                    >
                    By Profile URL
                    </Button>
                </div>
                
                <div className="space-y-2">
                    <Label>
                    {influencerInputType === 'name' ? 'Influencer Name' : 'Profile URL'} *
                    </Label>
                    <Input
                    placeholder={
                        influencerInputType === 'name' 
                        ? "Enter influencer name" 
                        : "https://socialplatform.com/username"
                    }
                    value={influencerIdentifier}
                    onChange={(e) => setInfluencerIdentifier(e.target.value)}
                    />
                </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Time Range *</Label>
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
                    <Label>Products to Find</Label>
                    <Input
                    type="number"
                    min="0"
                    value={productsCount}
                    onChange={(e) => setProductsCount(Math.max(0, Number(e.target.value)))}
                    />
                </div>
                </div>

                <div className="space-y-4">

                <div className="space-y-2">
                    <Label>Research Notes</Label>
                    <Textarea
                    placeholder="Add specific instructions or focus areas..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
                </div>

                <Separator />

                <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Claims to Analyze *</Label>
                    <Input
                    type="number"
                    min="10"
                    max="1000"
                    value={claimsCount}
                    onChange={(e) => setClaimsCount(Number(e.target.value))}
                    />
                    {claimsCount < 50 && (
                    <p className="text-sm text-yellow-600">
                        For comprehensive analysis, we recommend analyzing at least 50 claims
                    </p>
                    )}
                </div>

                <div className="space-y-4">
                    <Label>Scientific Journals *</Label>
                    <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Checkbox
                        id="select-all"
                        checked={selectedJournals.size === predefinedJournals.length}
                        onCheckedChange={(checked) => {
                            setSelectedJournals(checked ? new Set(predefinedJournals) : new Set())
                        }}
                        />
                        <Label htmlFor="select-all">Select All Predefined</Label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {predefinedJournals.map((journal) => (
                        <div key={journal} className="flex items-center space-x-2">
                            <Checkbox
                            id={journal}
                            checked={selectedJournals.has(journal)}
                            onCheckedChange={() => handleJournalSelect(journal)}
                            />
                            <Label htmlFor={journal}>{journal}</Label>
                        </div>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Label>Add Custom Journal</Label>
                        <div className="flex gap-2">
                        <Input
                            placeholder="Journal name or website"
                            value={customJournal}
                            onChange={(e) => setCustomJournal(e.target.value)}
                        />
                        <Button
                            variant="secondary"
                            onClick={addCustomJournal}
                            disabled={!customJournal.trim()}
                        >
                            Add
                        </Button>
                        </div>
                    </div>

                    {Array.from(selectedJournals).filter(j => !predefinedJournals.includes(j)).length > 0 && (
                        <div className="space-y-2">
                        <Label>Custom Journals Added</Label>
                        <div className="flex flex-wrap gap-2">
                            {Array.from(selectedJournals)
                            .filter(j => !predefinedJournals.includes(j))
                            .map(journal => (
                                <Badge 
                                key={journal}
                                variant="outline"
                                className="cursor-pointer hover:bg-red-100"
                                onClick={() => handleJournalSelect(journal)}
                                >
                                {journal} ×
                                </Badge>
                            ))}
                        </div>
                        </div>
                    )}
                    </div>
                </div>
                </div>

                <Button 
                className="w-full md:w-auto"
                onClick={handleSubmitResearch}
                disabled={!validateForm()}
                >
                + Start Research
                </Button>
            </CardContent>
        </Card>
    )
}
