import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WorkOrder, WarrantyDraft, ClaimData } from "../types";
import { WARRANTY_POLICY_CONTEXT } from "../constants";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const warrantySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    coveredItems: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of IDs of labor or parts that are covered by warranty",
    },
    missedOpportunities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          itemId: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
      },
      description: "Items not typically covered but identified as potential claims based on context",
    },
    threeCs: {
      type: Type.OBJECT,
      properties: {
        concern: { type: Type.STRING },
        cause: { type: Type.STRING },
        correction: { type: Type.STRING },
      },
      description: "Generated 3Cs (Concern, Cause, Correction) for the claim form",
    },
    exclusionFlags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Warnings about items that might be rejected",
    },
    totalClaimable: {
      type: Type.NUMBER,
      description: "Estimated total value of the claim",
    },
  },
  required: ["coveredItems", "threeCs", "totalClaimable"],
};

const updateClaimSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    threeCs: {
      type: Type.OBJECT,
      properties: {
        concern: { type: Type.STRING },
        cause: { type: Type.STRING },
        correction: { type: Type.STRING },
      },
      description: "Updated 3Cs",
    },
    explanation: {
      type: Type.STRING,
      description: "Brief explanation of what was changed",
    }
  },
  required: ["threeCs", "explanation"],
};

export const generateWarrantyDraft = async (workOrder: WorkOrder): Promise<WarrantyDraft> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    You are an expert Warranty Agent for a fleet management company.
    Analyze the following Work Order and the Warranty Policy context.
    
    Work Order Data:
    ${JSON.stringify(workOrder, null, 2)}
    
    Warranty Policy Context:
    ${WARRANTY_POLICY_CONTEXT}
    
    Your goal is to draft a warranty claim.
    1. Identify parts and labor that appear to be covered.
    2. Identify consumables that should be EXCLUDED (e.g., shop supplies).
    3. Generate professional "3Cs" (Concern, Cause, Correction) based on the work description.
    4. Look for "Missed Opportunities" - e.g., if a part was replaced, was the labor included?
    5. Calculate the total estimated claimable amount.
    
    For the "Front mirror missing" task, assume it is a structural failure covered by warranty, but flag it to check for impact damage.
    For the "Oil change", assume standard maintenance is NOT covered, but the Oil Filter might be if it was defective (just for example purposes, exclude it usually).
    Actually, for this demo, let's assume the Mirror Assembly and its Labor are COVERED. The Oil Change is NOT covered.
    
    Return the response in JSON format matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: warrantySchema,
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response from AI");
    }
    return JSON.parse(text) as WarrantyDraft;
  } catch (error) {
    console.error("Error generating warranty draft:", error);
    // Fallback mock response if API fails or key is missing
    return {
      coveredItems: ["part-004", "labor-003"],
      missedOpportunities: [{ itemId: "part-001", reason: "Washer might be claimable if associated with a pan failure." }],
      threeCs: {
        concern: "Driver reported missing side mirror assembly.",
        cause: "Internal retention bracket failure causing detachment during operation.",
        correction: "Replaced side mirror assembly and verified secure fitment.",
      },
      exclusionFlags: ["Check for signs of external impact on mirror housing."],
      totalClaimable: 690.00,
      status: 'ready'
    };
  }
};

export const updateClaimDraft = async (currentClaim: ClaimData, instruction: string): Promise<{ threeCs: any, explanation: string }> => {
  const model = "gemini-3-flash-preview";

  const prompt = `
    You are an expert Warranty Agent helper. 
    The user is reviewing a warranty claim draft and wants to make changes.
    
    Current Claim Data:
    ${JSON.stringify(currentClaim, null, 2)}
    
    User Instruction: "${instruction}"
    
    Please update the 3Cs (Concern, Cause, Correction) based on the user's instruction.
    If the user asks for more details, expand upon the existing text professionally.
    If the user provides new facts, incorporate them.
    
    Return the updated 3Cs and a brief explanation of what you did.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: updateClaimSchema,
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response from AI");
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Error updating claim:", error);
    return {
      threeCs: currentClaim.threeCs,
      explanation: "I couldn't update the claim at this time."
    };
  }
}