import { GoogleGenAI, Modality } from "@google/genai";
import { AD_SCENARIOS } from '../constants';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * A helper function to retry an async function if it fails.
 * @param fn The async function to retry.
 * @param retries The number of retry attempts.
 * @param delay The delay between retries in milliseconds.
 * @returns The result of the async function.
 */
const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
    let lastError: unknown;
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            console.warn(`Attempt ${i + 1} of ${retries} failed. Retrying...`, error);
            if (i < retries - 1) {
              await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
            }
        }
    }
    throw lastError;
};

export async function generateSlogan(base64ImageData: string, mimeType: string): Promise<string> {
    const imagePart = {
        inlineData: {
            data: base64ImageData,
            mimeType: mimeType,
        },
    };
    const textPart = {
        text: "Based on this product image, generate a short, catchy marketing slogan. The slogan should be 5-10 words long. Only return the slogan text, without any quotes or extra formatting."
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });

    return response.text.trim();
}


export async function generateAdImages(
    base64ImageData: string,
    mimeType: string,
    onAdGenerated: (adDataUrl: string, scenarioText: string, index: number) => void,
    slogan?: string
): Promise<void> {
    const imagePart = {
        inlineData: {
            data: base64ImageData,
            mimeType: mimeType,
        },
    };

    let successfulGenerations = 0;
    let scenarioIndex = 0;
    const targetCount = 10;

    while (successfulGenerations < targetCount && scenarioIndex < AD_SCENARIOS.length) {
        let scenario = AD_SCENARIOS[scenarioIndex];
        
        // Append slogan instruction to the prompt if a slogan is provided
        if (slogan && slogan.trim() !== '') {
            scenario = `${scenario} The ad must visibly include the marketing slogan text: "${slogan}"`;
        }
        
        const generationTask = async () => {
            console.log(`Generating ad for scenario: ${scenario}`);
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: {
                    parts: [imagePart, { text: scenario }],
                },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });
            
            const imagePartFound = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

            if (!imagePartFound?.inlineData) {
                console.warn(`No image part found in response for scenario: "${scenario}". Full response:`, JSON.stringify(response, null, 2));
                throw new Error(`No image part found in response for scenario: "${scenario}"`);
            }
            
            return imagePartFound.inlineData;
        };

        try {
            const inlineData = await withRetry(generationTask);
            const base64ImageBytes = inlineData.data;
            const imageUrl = `data:${inlineData.mimeType};base64,${base64ImageBytes}`;
            // Return the original scenario text for display purposes, without the slogan part
            onAdGenerated(imageUrl, AD_SCENARIOS[scenarioIndex], successfulGenerations);
            successfulGenerations++;
        } catch (error) {
            console.error(`Failed to generate ad for scenario "${scenario}" after multiple retries. Trying next scenario.`, error);
        } finally {
            scenarioIndex++;
        }
    }

    if (successfulGenerations < targetCount) {
        console.warn(`Could not generate the target of ${targetCount} ads. Generated ${successfulGenerations}.`);
        // In a real app, we might want to surface this to the user.
    }
}