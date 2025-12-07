"use client"

import { useState, useEffect } from 'react'

export interface Atmosphere {
    timeOfDay: 'Dawn' | 'Day' | 'Dusk' | 'Night' | 'Late Night';
    suggestedMode: 'Structural' | 'Active' | 'Reflective' | 'Dream Logic';
}

export function useAtmosphere() {
    const [atmosphere, setAtmosphere] = useState<Atmosphere>({
        timeOfDay: 'Day',
        suggestedMode: 'Active'
    });

    useEffect(() => {
        const updateAtmosphere = () => {
            const hour = new Date().getHours();
            let timeOfDay: Atmosphere['timeOfDay'] = 'Day';
            let suggestedMode: Atmosphere['suggestedMode'] = 'Active';

            if (hour >= 5 && hour < 10) {
                timeOfDay = 'Dawn';
                suggestedMode = 'Structural'; // Best time for planning
            } else if (hour >= 10 && hour < 17) {
                timeOfDay = 'Day';
                suggestedMode = 'Active'; // Best time for drafting
            } else if (hour >= 17 && hour < 21) {
                timeOfDay = 'Dusk';
                suggestedMode = 'Reflective'; // Best time for editing
            } else if (hour >= 21 || hour < 2) {
                timeOfDay = 'Night';
                suggestedMode = 'Dream Logic'; // Best for creative wandering
            } else {
                timeOfDay = 'Late Night';
                suggestedMode = 'Dream Logic';
            }

            setAtmosphere({ timeOfDay, suggestedMode });
        };

        updateAtmosphere();
        // Check every minute
        const interval = setInterval(updateAtmosphere, 60000);
        return () => clearInterval(interval);
    }, []);

    return atmosphere;
}
