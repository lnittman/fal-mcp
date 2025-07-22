# Tool Migration Plan

## Overview
Update all fal-mcp tools to use shared utilities for consistency, reduced code duplication, and better maintainability.

## Shared Utilities Created

### `/src/utils/tool-base.ts`
- `initializeFalClient()` - Initialize fal client with credentials
- `validateModel()` - Validate model ID format
- `submitToFal()` - Submit request with debug logging
- `formatMediaResult()` - Format URL output
- `formatDataResult()` - Format JSON output
- `formatBatchResult()` - Format batch operation output
- `formatError()` - Consistent error formatting
- `extractImageUrl()` - Extract image URL from various response formats
- `extractVideoUrl()` - Extract video URL from various response formats
- `extractAudioUrl()` - Extract audio URL from various response formats

### `/src/utils/errors.ts`
- `extractErrorInfo()` - Extract meaningful error messages
- `formatErrorMessage()` - Format errors for display

### `/src/utils/debug.ts`
- `debug()` - Environment-controlled debug logging

## Migration Steps for Each Tool

### 1. Import Shared Utilities
```typescript
import {
  initializeFalClient,
  validateModel,
  submitToFal,
  formatMediaResult,
  formatError,
  extractImageUrl, // or extractVideoUrl, extractAudioUrl
} from "../utils/tool-base";
```

### 2. Remove Duplicate Code
- Remove manual `fal.config()` calls
- Remove inline error handling
- Remove console.log/error statements
- Remove manual URL extraction logic

### 3. Update Model Schema
Change from:
```typescript
model: z.enum(["fal-ai/flux/dev", "fal-ai/flux/schnell"])
```
To:
```typescript
model: z.string().default("fal-ai/flux/dev").describe("Any fal-ai model ID...")
```

### 4. Standardize Function Structure
```typescript
export default async function toolName(params: InferSchema<typeof schema>) {
  const { ...params } = params;
  const toolName = 'toolName';
  
  try {
    // Initialize and validate
    await validateModel(model, toolName);
    initializeFalClient(toolName);

    // Prepare input
    const input = {
      // ... model-specific input
    };

    // Submit to fal.ai
    const response = await submitToFal(model, input, toolName);
    
    // Extract result (for media tools)
    const url = extractImageUrl(response, toolName);
    return formatMediaResult(url);
    
    // OR for data tools
    return formatDataResult(response);
    
  } catch (error: any) {
    return formatError(error, 'Error description');
  }
}
```

## Tools to Update (Priority Order)

### High Priority - Core Media Tools
1. ✅ imageToVideo - Updated as example
2. ✅ textToImage - Updated as example
3. imageToImage - Has console logging
4. backgroundRemoval - Has enum
5. upscaleImage - Has enum
6. textToVideo - Has enum, no validation
7. audioToAudio - Needs standardization
8. textToAudio - Has enum
9. textToSpeech - Has enum, no validation
10. speechToText - Has enum, no validation

### Medium Priority - Batch/Special Tools
11. batchBackgroundRemoval - Has enum
12. batchProcessImages - Has enum
13. objectRemoval - Has enum, no validation
14. workflowChain - Complex, needs careful update
15. textToImageWithPreset - Has enum

### Low Priority - Utility Tools
16. imageToJson - Has enum
17. jsonTools - Different pattern
18. saveImage - Has enum
19. listModelsDynamic - Meta tool
20. discoverModelsDynamic - Meta tool
21. recommendModel - Meta tool

## Testing Strategy

### After Each Update
1. Build: `npm run build`
2. Test basic functionality
3. Test error cases
4. Verify output format

### Integration Tests Needed
- Test each tool with valid inputs
- Test with invalid model IDs
- Test with missing API key
- Test with malformed inputs
- Test batch operations

## Benefits After Migration

1. **Consistency**: All tools follow same patterns
2. **Maintainability**: Changes in one place affect all tools
3. **Debugging**: Centralized debug logging
4. **Error Handling**: Consistent error messages
5. **Model Support**: Dynamic model support everywhere
6. **Code Reduction**: ~30-40% less code per tool
7. **Production Ready**: No console logs, proper error handling

## Rollback Plan
- Keep original files until all updates tested
- Use `-updated.ts` suffix during migration
- Replace originals only after verification