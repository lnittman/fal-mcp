import { describe, it, expect, beforeEach } from 'vitest';
import getSystemInstructions from '../../tools/getSystemInstructions';

describe('getSystemInstructions', () => {
  beforeEach(() => {
    // Ensure we're in mock mode
    process.env.FAL_MCP_MOCK = 'true';
  });

  it('should provide system instructions in XML format', async () => {
    const result = await getSystemInstructions({
      format: 'xml',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('<system>');
    expect(result.content[0].text).toContain('<tools>');
    expect(result.content[0].text).toContain('<models>');
  });

  it('should provide system instructions in JSON format', async () => {
    const result = await getSystemInstructions({
      format: 'json',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('"tools":');
    expect(result.content[0].text).toContain('"models":');
    expect(() => JSON.parse(result.content[0].text)).not.toThrow();
  });

  it('should provide system instructions in Markdown format', async () => {
    const result = await getSystemInstructions({
      format: 'markdown',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('# System Instructions');
    expect(result.content[0].text).toContain('## Tools');
    expect(result.content[0].text).toContain('## Models');
  });

  it('should default to XML format', async () => {
    const result = await getSystemInstructions({});

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('<system>');
  });

  it('should include tool information', async () => {
    const result = await getSystemInstructions({
      format: 'xml',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('textToImage');
    expect(result.content[0].text).toContain('imageToImage');
  });

  it('should include model information', async () => {
    const result = await getSystemInstructions({
      format: 'xml',
    });

    expect(result).toBeDefined();
    expect(result.content[0].text).toContain('fal-ai/flux/dev');
  });
});