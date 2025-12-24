
/**
 * AI Services are currently disabled to maintain 100% local, ad-free conversion.
 * PDFlow Pro focuses on browser-native performance and privacy.
 */
export const refineHtml = async (currentHtml: string, request: string): Promise<string> => {
  console.warn("AI Refinement is disabled in this ad-free local version.");
  return currentHtml;
};

export const generateTemplateHtml = async (prompt: string): Promise<string> => {
  console.warn("AI Template generation is disabled. Please use static blueprints.");
  return "";
};
