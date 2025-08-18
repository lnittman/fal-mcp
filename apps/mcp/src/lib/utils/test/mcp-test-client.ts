#!/usr/bin/env node

/**
 * MCP Test Client for fal-mcp
 *
 * This client simulates an AI agent using the fal-mcp tools,
 * allowing us to test tool chaining, parameter discovery, and error handling.
 */

import path from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio";

interface TestScenario {
  name: string;
  description: string;
  steps: TestStep[];
  expectedOutcome?: string;
}

interface TestStep {
  tool: string;
  params: any;
  expectSuccess?: boolean;
  expectError?: string;
  saveResultAs?: string; // Save result for use in next steps
}

class MCPTestClient {
  private client?: Client;
  private savedResults: Map<string, any> = new Map();

  async connect() {
    const serverPath = path.join(__dirname, "../../dist/index.js");
    const transport = new StdioClientTransport({
      command: "node",
      args: [serverPath],
      env: {
        ...process.env,
        FAL_MCP_MOCK: "true", // Always use mock mode for tests
        FAL_MCP_DEBUG: "true",
      },
    });

    this.client = new Client(
      {
        name: "test-client",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: true,
        },
      }
    );

    await this.client.connect(transport);
    console.log("✅ Connected to MCP server");
  }

  async disconnect() {
    await this.client?.close();
    console.log("👋 Disconnected from MCP server");
  }

  async runScenario(scenario: TestScenario) {
    console.log(`\n🧪 Running scenario: ${scenario.name}`);
    console.log(`📝 ${scenario.description}\n`);

    for (let i = 0; i < scenario.steps.length; i++) {
      const step = scenario.steps[i];
      console.log(`Step ${i + 1}: ${step.tool}`);

      try {
        // Replace saved result placeholders
        const params = this.replaceSavedResults(step.params);

        const result = await this.client!.callTool(step.tool, params);

        if (step.expectSuccess !== false) {
          console.log(`✅ Success: ${this.extractResultUrl(result)}`);

          if (step.saveResultAs) {
            this.savedResults.set(step.saveResultAs, this.extractResultUrl(result));
            console.log(`💾 Saved as: ${step.saveResultAs}`);
          }
        }
      } catch (error: any) {
        if (step.expectError) {
          console.log(`✅ Expected error: ${error.message}`);
        } else {
          console.log(`❌ Unexpected error: ${error.message}`);
        }
      }
    }

    if (scenario.expectedOutcome) {
      console.log(`\n📊 Expected outcome: ${scenario.expectedOutcome}`);
    }
  }

  private replaceSavedResults(params: any): any {
    const json = JSON.stringify(params);
    const replaced = json.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return this.savedResults.get(key) || match;
    });
    return JSON.parse(replaced);
  }

  private extractResultUrl(result: any): string {
    if (result?.content?.[0]?.text) {
      return result.content[0].text;
    }
    return "No URL found";
  }
}

// Test scenarios
const scenarios: TestScenario[] = [
  {
    name: "Basic Image Generation",
    description: "Test simple text-to-image generation",
    steps: [
      {
        tool: "textToImage",
        params: {
          prompt: "A futuristic city at night",
          model: "fal-ai/flux/dev",
          parameters: {
            image_size: "landscape_16_9",
          },
        },
        saveResultAs: "cityImage",
      },
    ],
  },

  {
    name: "Image Processing Pipeline",
    description: "Generate → Remove Background → Upscale",
    steps: [
      {
        tool: "textToImage",
        params: {
          prompt: "A robot on white background",
          model: "fal-ai/flux/schnell",
        },
        saveResultAs: "robotImage",
      },
      {
        tool: "backgroundRemoval",
        params: {
          imageUrl: "{{robotImage}}",
          model: "fal-ai/birefnet",
        },
        saveResultAs: "robotNoBg",
      },
      {
        tool: "upscaleImage",
        params: {
          imageUrl: "{{robotNoBg}}",
          model: "fal-ai/aura-sr",
          parameters: {
            scale: 4,
          },
        },
        saveResultAs: "robotFinal",
      },
    ],
    expectedOutcome: "High-res robot image with transparent background",
  },

  {
    name: "Model Discovery Test",
    description: "Test agent ability to discover model parameters",
    steps: [
      {
        tool: "listModelsDynamic",
        params: {
          query: "video generation",
        },
      },
      {
        tool: "discoverModelsDynamic",
        params: {
          operation: "validate",
          modelId: "fal-ai/ltxv/image-to-video",
        },
      },
      {
        tool: "imageToVideo",
        params: {
          imageUrl: "https://example.com/test.jpg",
          model: "fal-ai/ltxv/image-to-video",
          parameters: {
            // Agent would discover these through trial/error
            prompt: "Camera slowly zooming in",
            num_frames: 97,
            frame_rate: 24,
          },
        },
      },
    ],
  },

  {
    name: "Error Handling",
    description: "Test invalid parameters and model IDs",
    steps: [
      {
        tool: "textToImage",
        params: {
          prompt: "Test",
          model: "not-a-valid-model",
        },
        expectSuccess: false,
        expectError: "Invalid model ID format",
      },
      {
        tool: "imageToVideo",
        params: {
          // Missing required imageUrl
          model: "fal-ai/wan-effects",
        },
        expectSuccess: false,
        expectError: "imageUrl",
      },
    ],
  },

  {
    name: "Complex Workflow Chain",
    description: "Test the workflow chain tool",
    steps: [
      {
        tool: "workflowChain",
        params: {
          steps: [
            {
              type: "generate",
              model: "fal-ai/flux/dev",
              parameters: {
                prompt: "A dancing cat, pixar style",
              },
            },
            {
              type: "upscale",
              model: "fal-ai/clarity-upscaler",
              parameters: {
                scale: 2,
                overlapping_factor: 0.6,
              },
            },
            {
              type: "animate",
              model: "fal-ai/wan-effects",
              parameters: {
                motion_prompt: "cat dancing happily",
                duration: 3,
                fps: 24,
              },
            },
          ],
        },
      },
    ],
    expectedOutcome: "Animated video of upscaled dancing cat",
  },
];

// Run tests
async function runTests() {
  const client = new MCPTestClient();

  try {
    await client.connect();

    for (const scenario of scenarios) {
      await client.runScenario(scenario);
      console.log(`\n${"=".repeat(60)}\n`);
    }

    console.log("🎉 All test scenarios completed!");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await client.disconnect();
  }
}

// CLI support
if (require.main === module) {
  runTests().catch(console.error);
}

export { MCPTestClient, type TestScenario, type TestStep };
