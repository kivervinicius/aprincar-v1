export interface StrokePoint {
  x: number;
  y: number;
  t?: number;
  pressure?: number;
}
export interface HandwritingInput {
  symbol: string;
  strokes: StrokePoint[][];
}
export interface HandwritingResult {
  recognized: boolean;
  confidence: number;
  shape: number;
  coverage: number;
  structure: number;
}
export function evaluateHandwriting(input: HandwritingInput): HandwritingResult {
  const points = input.strokes.flat();
  if (points.length < 4 || input.strokes.length === 0)
    return { recognized: false, confidence: 0, shape: 0, coverage: 0, structure: 0 };
  const xs = points.map((p) => p.x),
    ys = points.map((p) => p.y);
  const width = Math.max(...xs) - Math.min(...xs),
    height = Math.max(...ys) - Math.min(...ys);
  const coverage = Math.min(1, Math.max(0, (width * height) / 0.24));
  const requiredStrokes = ['A', 'E', 'F', 'H', 'I', 'K', 'M', 'N', 'T', 'X', 'Y'].includes(
    input.symbol.toUpperCase(),
  )
    ? 2
    : 1;
  const structure = Math.min(1, input.strokes.length / requiredStrokes);
  const path = points
    .slice(1)
    .reduce((sum, p, i) => sum + Math.hypot(p.x - points[i]!.x, p.y - points[i]!.y), 0);
  const shape = Math.min(1, path / 1.2);
  const confidence = Number((coverage * 0.35 + structure * 0.35 + shape * 0.3).toFixed(3));
  return {
    recognized: confidence >= 0.58 && structure >= 0.65,
    confidence,
    shape: Number(shape.toFixed(3)),
    coverage: Number(coverage.toFixed(3)),
    structure: Number(structure.toFixed(3)),
  };
}
