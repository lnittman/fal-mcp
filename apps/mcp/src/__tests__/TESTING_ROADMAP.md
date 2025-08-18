# Testing Roadmap for fal-mcp

## Current State
- **4 tools tested** out of 22 (18% coverage)
- **38 tests total**, all passing
- Strong mock infrastructure in place
- Tests validate discovery philosophy

## Priority 1: Core Tools with Unique Logic (5 tools)

### 1. speechToText.test.ts
Tests needed:
- Basic transcription with default model
- Multiple parameter name attempts (return_timestamps, include_timestamps, timestamps)
- Language detection
- Translation mode
- Mock response for transcription format

### 2. batchProcessImages.test.ts
Tests needed:
- Directory traversal logic
- File filtering (image types only)
- Batch transformation application
- Output file naming with suffix
- Error handling for missing directory

### 3. modelDocs.test.ts
Tests needed:
- File system integration for reading docs
- Model ID to filename conversion
- Handling missing documentation
- Mock file system for testing

### 4. saveImage.test.ts
Tests needed:
- URL download simulation
- File system writing (mocked)
- Image resizing parameters
- Format conversion
- Error handling for invalid URLs

### 5. objectRemoval.test.ts
Tests needed:
- Mask URL requirement validation
- Multiple parameter variations
- Model-agnostic approach
- Background prompt handling

## Priority 2: Discovery Tools (3 tools)

### 6. recommendModel.test.ts
Tests needed:
- Task interpretation
- Discovery strategy generation
- Context handling
- Non-prescriptive responses

### 7. discoverModelsDynamic.test.ts
Tests needed:
- Model ID validation
- Operation types (validate, suggest, infer)
- Pattern-based suggestions
- Error handling

### 8. listModelsDynamic.test.ts
Tests needed:
- Query handling
- Pattern exploration
- Non-hardcoded responses

## Priority 3: Audio/Video Tools (8 tools)

### 9. textToAudio.test.ts
### 10. audioToAudio.test.ts
### 11. textToSpeech.test.ts
### 12. textToVideo.test.ts
- Similar to existing imageToVideo tests
- Parameter discovery approach

## Priority 4: Remaining Image Tools (6 tools)

### 13. imageToImage.test.ts
### 14. upscaleImage.test.ts
### 15. backgroundRemoval.test.ts
### 16. batchBackgroundRemoval.test.ts
### 17. imageToJson.test.ts
### 18. textToImageWithPreset.test.ts

## Integration Test Suite

### Real-World Workflows
```typescript
describe('Real-World Workflows', () => {
  it('should handle Cole Palmer workflow', async () => {
    // 1. Generate Cole Palmer image
    const image = await textToImage({
      prompt: 'Cole Palmer celebrating',
      model: 'fal-ai/flux/dev'
    });
    
    // 2. Convert to pixel art
    const pixelArt = await imageToImage({
      imageUrl: extractUrl(image),
      prompt: 'pixel art style',
      model: 'fal-ai/flux-general/image-to-image'
    });
    
    // 3. Animate the pixel art
    const video = await imageToVideo({
      imageUrl: extractUrl(pixelArt),
      model: 'fal-ai/wan-effects'
    });
    
    // 4. Add audio
    const audio = await textToAudio({
      prompt: 'upbeat celebration music',
      model: 'fal-ai/stable-audio'
    });
  });
  
  it('should handle batch processing workflow', async () => {
    // Test batch background removal
    // Test batch style transfer
  });
  
  it('should handle discovery workflow', async () => {
    // Test model recommendation
    // Test model discovery
    // Test documentation retrieval
  });
});
```

## Testing Principles

1. **Mock Everything**: Continue using mock mode to avoid API costs
2. **Test Philosophy, Not Implementation**: Verify tools accept any model/parameters
3. **Error Learning**: Test that errors are passed through for agent learning
4. **No Hardcoding**: Ensure tests don't assume specific models or parameters

## Implementation Strategy

1. **Create test template** for consistency:
   ```typescript
   describe('toolName', () => {
     beforeEach(() => {
       process.env.FAL_MCP_MOCK = 'true';
     });
     
     it('should work with any fal-ai model', async () => {
       // Test with arbitrary model
     });
     
     it('should pass through any parameters', async () => {
       // Test parameter discovery
     });
     
     it('should handle errors gracefully', async () => {
       // Test error scenarios
     });
   });
   ```

2. **Extend mock infrastructure** as needed for specific tools

3. **Run coverage reports** after each priority group

## Success Metrics

- [ ] 80%+ tool coverage (18+ tools tested)
- [ ] Integration tests for 3+ real workflows
- [ ] All tests follow discovery philosophy
- [ ] Mock infrastructure handles all tool types
- [ ] Tests serve as documentation

## Next Steps

1. Start with Priority 1 tools (unique logic)
2. Add integration tests early
3. Gradually expand to remaining tools
4. Maintain test quality over quantity