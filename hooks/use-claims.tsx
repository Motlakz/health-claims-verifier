"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { HealthClaim } from "@/types"
import { mockClaims } from "@/types/mock-data"

type ClaimsContextType = {
    claims: HealthClaim[]
    setClaims: React.Dispatch<React.SetStateAction<HealthClaim[]>>
}

const ClaimsContext = createContext<ClaimsContextType>({
    claims: [],
    setClaims: () => {}
})

export function ClaimsProvider({ children }: { children: React.ReactNode }) {
    const [claims, setClaims] = useState<HealthClaim[]>([])

    // In ClaimsProvider
    useEffect(() => {
        const savedClaims = localStorage.getItem("claims")
        if (savedClaims) {
            setClaims(JSON.parse(savedClaims))
        } else {
            setClaims(mockClaims)
            localStorage.setItem("claims", JSON.stringify(mockClaims))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("claims", JSON.stringify(claims))
    }, [claims])

    return (
        <ClaimsContext.Provider value={{ claims, setClaims }}>
            {children}
        </ClaimsContext.Provider>
    )
}

export const useClaims = () => useContext(ClaimsContext)
