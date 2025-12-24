
export enum PaperSize {
  A4 = 'a4',
  LETTER = 'letter',
  LEGAL = 'legal'
}

export enum Orientation {
  PORTRAIT = 'p',
  LANDSCAPE = 'l'
}

export interface PDFConfig {
  size: PaperSize;
  orientation: Orientation;
  margins: number; // in mm
}

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  prompt: string;
}
