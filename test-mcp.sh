#!/bin/bash
# Test script for fal-mcp with mock mode

echo "🧪 Testing fal-mcp in mock mode..."
echo "================================="

# Set mock mode
export FAL_MCP_MOCK=true
export FAL_MCP_DEBUG=true

# Function to test MCP tool
test_tool() {
    local tool_name=$1
    local params=$2
    echo ""
    echo "📌 Testing: $tool_name"
    echo "Parameters: $params"
    
    # Use npx to run the MCP client with our server
    echo "$params" | npx @modelcontextprotocol/mcp-client stdio \
        --tool "$tool_name" \
        --server "node dist/index.js"
}

# Build the project first
echo "🔨 Building project..."
npm run build

# Test 1: Text to Image
test_tool "textToImage" '{
  "prompt": "A beautiful sunset over mountains",
  "model": "fal-ai/flux/dev",
  "parameters": {
    "image_size": "landscape_16_9",
    "num_inference_steps": 28
  }
}'

# Test 2: Image to Video  
test_tool "imageToVideo" '{
  "imageUrl": "https://example.com/test.jpg",
  "model": "fal-ai/wan-effects",
  "parameters": {
    "motion_prompt": "gentle wind blowing",
    "duration": 4
  }
}'

# Test 3: Background Removal
test_tool "backgroundRemoval" '{
  "imageUrl": "https://example.com/person.jpg",
  "model": "fal-ai/birefnet",
  "parameters": {
    "output_format": "png"
  }
}'

# Test 4: Workflow Chain
test_tool "workflowChain" '{
  "steps": [
    {
      "type": "generate",
      "model": "fal-ai/flux/dev",
      "parameters": {
        "prompt": "A cute robot"
      }
    },
    {
      "type": "removeBackground",
      "model": "fal-ai/birefnet"
    },
    {
      "type": "animate",
      "model": "fal-ai/wan-effects",
      "parameters": {
        "motion_prompt": "robot dancing",
        "duration": 3
      }
    }
  ]
}'

echo ""
echo "✅ Mock tests complete!"
echo ""
echo "To run with real API:"
echo "unset FAL_MCP_MOCK"
echo "export FAL_API_KEY=your_key_here"