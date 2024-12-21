interface Performance {
  measureUserAgentSpecificMemory: () => Promise<{
    bytes: number;
    breakdown: {
      bytes: number;
      attribution: string[];
      types: string[];
    }[];
  }>;
}

