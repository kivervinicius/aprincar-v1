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

type Point = { x: number; y: number };

export function evaluateHandwriting(input: HandwritingInput): HandwritingResult {
  if (!input || typeof input.symbol !== 'string' || !Array.isArray(input.strokes)) return empty();
  const strokes = input.strokes
    .filter((stroke) => Array.isArray(stroke) && stroke.length >= 2)
    .map((stroke) => stroke.map(({ x, y }) => ({ x, y })));
  const points = strokes.flat();
  if (points.length < 3 || points.some((p) => !validPoint(p))) return empty();

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);
  if (width < 0.12 || height < 0.18) return empty();

  const coverage = clamp((width * height) / 0.34, 0, 1);
  const pathLength = strokes.reduce((total, stroke) => total + lengthOf(stroke), 0);
  const pathScore = clamp(pathLength / 1.45, 0, 1);
  const symbol = input.symbol.trim().toUpperCase();
  const structure = scoreSymbol(symbol, strokes);
  const shape = clamp(structure * 0.72 + pathScore * 0.28, 0, 1);
  const confidence = clamp(structure * 0.62 + coverage * 0.2 + pathScore * 0.18, 0, 1);
  return {
    recognized: structure >= 0.62 && confidence >= 0.58,
    confidence: rounded(confidence),
    shape: rounded(shape),
    coverage: rounded(coverage),
    structure: rounded(structure),
  };
}

function scoreSymbol(symbol: string, strokes: Point[][]): number {
  switch (symbol) {
    case 'A':
      return scoreA(strokes);
    case 'V':
      return scoreV(strokes);
    case 'T':
      return scoreT(strokes);
    case 'B':
      return scoreB(strokes);
    case 'R':
      return scoreR(strokes);
    default:
      return genericStructure(strokes);
  }
}

function scoreA(strokes: Point[][]) {
  const mountain = strokes.reduce((best, stroke) => Math.max(best, mountainScore(stroke)), 0);
  const crossbar = strokes.reduce((best, stroke) => Math.max(best, horizontalScore(stroke, 0.32, 0.76)), 0);
  const separate = strokes.length >= 2 ? 1 : 0;
  return clamp(mountain * 0.58 + crossbar * 0.32 + separate * 0.1, 0, 1);
}

function mountainScore(stroke: Point[]) {
  if (stroke.length < 3) return 0;
  const start = stroke[0]!;
  const end = stroke.at(-1)!;
  const apex = stroke.reduce((best, point) => (point.y < best.y ? point : best), stroke[0]!);
  const centered = 1 - clamp(Math.abs(apex.x - 0.5) / 0.38, 0, 1);
  const rise = clamp((Math.min(start.y, end.y) - apex.y) / 0.55, 0, 1);
  const spread = clamp((end.x - start.x) / 0.55, 0, 1);
  const orientation = start.x < apex.x && apex.x < end.x ? 1 : 0;
  return centered * 0.2 + rise * 0.35 + spread * 0.25 + orientation * 0.2;
}

function scoreV(strokes: Point[][]) {
  let best = 0;
  for (const stroke of strokes) {
    if (stroke.length < 3) continue;
    const start = stroke[0]!;
    const end = stroke.at(-1)!;
    const valley = stroke.reduce(
      (candidate, point) => (point.y > candidate.y ? point : candidate),
      stroke[0]!,
    );
    const centered = 1 - clamp(Math.abs(valley.x - 0.5) / 0.38, 0, 1);
    const depth = clamp((valley.y - Math.max(start.y, end.y)) / 0.55, 0, 1);
    const spread = clamp((end.x - start.x) / 0.55, 0, 1);
    const orientation = start.x < valley.x && valley.x < end.x ? 1 : 0;
    best = Math.max(best, centered * 0.2 + depth * 0.4 + spread * 0.25 + orientation * 0.15);
  }
  return best;
}

function scoreT(strokes: Point[][]) {
  const horizontal = strokes.reduce((best, stroke) => Math.max(best, horizontalScore(stroke, 0, 0.42)), 0);
  const vertical = strokes.reduce((best, stroke) => Math.max(best, verticalScore(stroke, 0.3, 0.7)), 0);
  return clamp(horizontal * 0.48 + vertical * 0.47 + (strokes.length >= 2 ? 0.05 : 0), 0, 1);
}

function scoreB(strokes: Point[][]) {
  const vertical = strokes.reduce((best, stroke) => Math.max(best, verticalScore(stroke, 0, 0.4)), 0);
  const loop = strokes.reduce((best, stroke) => Math.max(best, rightLoopScore(stroke, false)), 0);
  return clamp(vertical * 0.48 + loop * 0.47 + (strokes.length >= 2 ? 0.05 : 0), 0, 1);
}

function scoreR(strokes: Point[][]) {
  const vertical = strokes.reduce((best, stroke) => Math.max(best, verticalScore(stroke, 0, 0.4)), 0);
  const loopLeg = strokes.reduce((best, stroke) => Math.max(best, rightLoopScore(stroke, true)), 0);
  return clamp(vertical * 0.46 + loopLeg * 0.49 + (strokes.length >= 2 ? 0.05 : 0), 0, 1);
}

function horizontalScore(stroke: Point[], minY: number, maxY: number) {
  if (stroke.length < 2) return 0;
  const start = stroke[0]!;
  const end = stroke.at(-1)!;
  const averageY = stroke.reduce((sum, p) => sum + p.y, 0) / stroke.length;
  const yDrift = Math.abs(end.y - start.y);
  const span = Math.abs(end.x - start.x);
  const inBand = averageY >= minY && averageY <= maxY ? 1 : 0;
  return clamp(span / 0.42, 0, 1) * 0.55 + clamp(1 - yDrift / 0.16, 0, 1) * 0.3 + inBand * 0.15;
}

function verticalScore(stroke: Point[], minX: number, maxX: number) {
  if (stroke.length < 2) return 0;
  const start = stroke[0]!;
  const end = stroke.at(-1)!;
  const averageX = stroke.reduce((sum, p) => sum + p.x, 0) / stroke.length;
  const xDrift = Math.abs(end.x - start.x);
  const span = Math.abs(end.y - start.y);
  const inBand = averageX >= minX && averageX <= maxX ? 1 : 0;
  return clamp(span / 0.55, 0, 1) * 0.55 + clamp(1 - xDrift / 0.18, 0, 1) * 0.3 + inBand * 0.15;
}

function rightLoopScore(stroke: Point[], requireLeg: boolean) {
  if (stroke.length < 3) return 0;
  const xs = stroke.map((p) => p.x);
  const ys = stroke.map((p) => p.y);
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);
  const rightward = Math.max(...xs) > 0.55 ? 1 : 0;
  const tall = height > 0.38 ? 1 : 0;
  const leg = requireLeg && stroke.at(-1)!.x > 0.55 && stroke.at(-1)!.y > 0.62 ? 1 : requireLeg ? 0 : 1;
  return clamp(width / 0.35, 0, 1) * 0.35 + rightward * 0.25 + tall * 0.2 + leg * 0.2;
}

function genericStructure(strokes: Point[][]) {
  return clamp(strokes.length / 2, 0.55, 1);
}

function validPoint(point: Point) {
  return (
    Number.isFinite(point.x) &&
    Number.isFinite(point.y) &&
    point.x >= 0 &&
    point.x <= 1 &&
    point.y >= 0 &&
    point.y <= 1
  );
}
function lengthOf(stroke: Point[]) {
  return stroke
    .slice(1)
    .reduce(
      (sum, point, index) => sum + Math.hypot(point.x - stroke[index]!.x, point.y - stroke[index]!.y),
      0,
    );
}
function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
function rounded(value: number) {
  return Number(value.toFixed(3));
}
function empty(): HandwritingResult {
  return { recognized: false, confidence: 0, shape: 0, coverage: 0, structure: 0 };
}
