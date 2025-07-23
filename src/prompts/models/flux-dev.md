# fal-ai/flux/dev

## Overview
FLUX.1 [dev] is a 12 billion parameter text-to-image model optimized for high quality and prompt adherence.

## Parameters

### Required
- `prompt` (string): Text description of the desired image

### Optional
- `image_size` (string): Output dimensions
  - Values: "square", "landscape_4_3", "portrait_4_3", "landscape_16_9", "portrait_16_9"
  - Default: "square"
- `num_inference_steps` (integer): Number of denoising steps
  - Range: 1-50
  - Default: 28
  - Higher = better quality, slower generation
- `guidance_scale` (number): How closely to follow the prompt
  - Range: 1.0-20.0
  - Default: 7.5
  - Higher = stricter prompt adherence
- `num_images` (integer): Number of images to generate
  - Range: 1-4
  - Default: 1
- `seed` (integer): Random seed for reproducibility
  - Range: 0-4294967295
  - Default: random

## Output Schema
```json
{
  "images": [
    {
      "url": "string",
      "width": "number",
      "height": "number",
      "content_type": "string"
    }
  ]
}
```

## Example Usage
```json
{
  "prompt": "A serene landscape with mountains at sunset, oil painting style",
  "image_size": "landscape_16_9",
  "num_inference_steps": 35,
  "guidance_scale": 8.0
}
```

## Tips
- Use descriptive prompts with style keywords
- Higher inference steps for final renders (35-50)
- Lower steps for quick iterations (20-28)
- Adjust guidance_scale based on prompt complexity