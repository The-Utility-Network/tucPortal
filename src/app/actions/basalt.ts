'use server';

interface BasaltAttribute {
    [key: string]: string | number | boolean;
}

export interface BasaltItem {
    id: string;
    wallet: string;
    sku: string;
    name: string;
    priceUsd: number;
    currency: string;
    stockQty: number;
    category: string;
    description: string;
    tags: string[];
    images: string[];
    attributes: BasaltAttribute;
    costUsd: number;
    taxable: boolean;
    jurisdictionCode: string;
    industryPack: string;
    createdAt: number;
    updatedAt: number;
}

interface BasaltInventoryResponse {
    items: BasaltItem[];
    total: number;
    page: number;
    pageSize: number;
    degraded?: boolean;
    reason?: string;
}

export async function getBasaltInventory(): Promise<{ items: BasaltItem[], error?: string }> {
    try {
        const apiKey = process.env.BASALT_SURGE_API_KEY;

        if (!apiKey) {
            console.error('SERVER ACTION ERROR: BASALT_SURGE_API_KEY is not defined in environment variables. Please check Vercel project settings.');
            return { items: [], error: 'Configuration error: API Key missing' };
        }

        const response = await fetch('https://surge.basalthq.com/api/inventory', {
            method: 'GET',
            headers: {
                'Ocp-Apim-Subscription-Key': apiKey,
                'Content-Type': 'application/json',
            },
            next: { revalidate: 60 }
        } as any);

        if (!response.ok) {
            console.error(`BasaltSurge API Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error('Response body:', text);
            return { items: [], error: `Failed to fetch inventory: ${response.statusText}` };
        }

        const data: BasaltInventoryResponse = await response.json();

        return { items: data.items || [] };
    } catch (error) {
        console.error('Error fetching BasaltSurge inventory:', error);
        return { items: [], error: 'Failed to connect to store service' };
    }
}
