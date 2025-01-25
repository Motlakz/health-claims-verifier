/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

type WorkflowField = {
    id: string
    label: string
} & (
    | { type: 'checkbox' }
    | { type: 'number'; min?: number; max?: number }
    | { type: 'select'; options: string[] }
)

type WorkflowStep = {
    id: string
    label: string
    description: string
    fields: WorkflowField[]
}

type ResearchWorkflow = {
    id: string
    title: string
    description: string
    steps: WorkflowStep[]
}

const researchWorkflows: ResearchWorkflow[] = [
    {
        id: 'source-analysis',
        title: 'Source Analysis & Data Collection',
        description: 'Systematic examination of influencer content sources',
        steps: 
        [
            {
                id: 'link-discovery',
                label: 'Profile & Content Discovery',
                description: 'Identify all relevant social profiles and content URLs',
                fields: [
                    {
                        type: 'checkbox',
                        label: 'Include archived content',
                        id: 'include-archived'
                    }
                ]
            },
            {
                id: 'content-extraction',
                label: 'Data Extraction',
                description: 'Collect posts, stories, and multimedia content',
                fields: [
                    {
                        type: 'number',
                        label: 'Maximum posts to analyze',
                        id: 'max-posts',
                        min: 50,
                        max: 5000
                    }
                ]
            }
        ]
        },
        {
            id: 'claim-verification',
            title: 'Claim Verification Process',
            description: 'Scientific validation of health-related statements',
            steps: [
            {
                id: 'source-tracking',
                label: 'Source Identification',
                description: 'Trace original claims to primary sources',
                fields: [
                {
                    type: 'checkbox',
                    label: 'Flag unattributed claims',
                    id: 'flag-unattributed'
                }
                ]
            },
            {
                id: 'evidence-validation',
                label: 'Evidence Validation',
                description: 'Cross-reference with scientific literature',
                fields: [
                    {
                        type: 'select',
                        label: 'Validation strictness',
                        id: 'validation-level',
                        options: ['Basic', 'Strict', 'Peer-Review Level']
                    }
                ]
            }
        ]
    }
]

export default function ResearchTasksTab() {
    const [workflowConfigs, setWorkflowConfigs] = useState<Record<string, any>>({})

    const handleFieldChange = (workflowId: string, stepId: string, fieldId: string, value: any) => {
        setWorkflowConfigs(prev => ({
        ...prev,
        [workflowId]: {
            ...prev[workflowId],
            [stepId]: {
            ...prev[workflowId]?.[stepId],
            [fieldId]: value
            }
        }
        }))
    }

    const toggleWorkflow = (workflowId: string) => {
        setWorkflowConfigs(prev => ({
        ...prev,
        [workflowId]: {
            ...prev[workflowId],
            enabled: !prev[workflowId]?.enabled
        }
        }))
    }

    const handleSubmit = () => {
        console.log('Research Workflow Configurations:', workflowConfigs)
        // API integration would go here
    }

    return (
        <Card>
        <CardHeader>
            <CardTitle>Research Workflows</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            {researchWorkflows.map((workflow) => (
            <div key={workflow.id} className="space-y-4">
                <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium">{workflow.title}</h3>
                    <p className="text-sm text-muted-foreground">{workflow.description}</p>
                </div>
                <Button
                    variant={workflowConfigs[workflow.id]?.enabled ? 'default' : 'outline'}
                    onClick={() => toggleWorkflow(workflow.id)}
                >
                    {workflowConfigs[workflow.id]?.enabled ? 'Enabled' : 'Enable'}
                </Button>
                </div>

                {workflowConfigs[workflow.id]?.enabled && (
                <div className="space-y-4 ml-4">
                    {workflow.steps.map((step) => (
                    <div key={step.id} className="space-y-4">
                        <Separator />
                        <div className="space-y-2">
                        <div className="space-y-1">
                            <h4 className="font-medium">{step.label}</h4>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                        <div className="space-y-4 ml-4">
                            {step.fields.map((field) => (
                            <div key={field.id} className="space-y-2">
                                {field.type === 'checkbox' && (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                    checked={workflowConfigs[workflow.id]?.[step.id]?.[field.id] || false}
                                    onCheckedChange={(checked) => 
                                        handleFieldChange(workflow.id, step.id, field.id, checked)
                                    }
                                    />
                                    <Label>{field.label}</Label>
                                </div>
                                )}
                                {field.type === 'number' && (
                                <div className="space-y-2">
                                    <Label>{field.label}</Label>
                                    <Input
                                    type="number"
                                    min={field.min}
                                    max={field.max}
                                    value={workflowConfigs[workflow.id]?.[step.id]?.[field.id]}
                                    onChange={(e) => 
                                        handleFieldChange(workflow.id, step.id, field.id, e.target.value)
                                    }
                                    />
                                </div>
                                )}
                                {field.type === 'select' && (
                                <div className="space-y-2">
                                    <Label>{field.label}</Label>
                                    <Select
                                    value={workflowConfigs[workflow.id]?.[step.id]?.[field.id]}
                                    onValueChange={(value) => 
                                        handleFieldChange(workflow.id, step.id, field.id, value)
                                    }
                                    >
                                    <SelectTrigger>
                                        <SelectValue placeholder={`Select ${field.label}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field.options.map(option => (
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                </div>
                                )}
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
            ))}

            <Button onClick={handleSubmit} className="w-full md:w-auto">
            Save Workflow Configuration
            </Button>
        </CardContent>
        </Card>
    )
}
