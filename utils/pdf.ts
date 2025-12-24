
import { PDFConfig, Orientation, PaperSize } from '../types';

declare const html2canvas: any;
declare const jspdf: any;

/**
 * Standard DPI calculation for web-to-print.
 * 96 DPI is the standard screen resolution for layout calculations.
 */
const DPI = 96;
const mmToPx = (mm: number) => (mm * DPI) / 25.4;

const fixSVGs = (root: HTMLElement) => {
  const svgs = root.querySelectorAll('svg');
  svgs.forEach((svg) => {
    const rect = svg.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      if (!svg.getAttribute('width')) svg.setAttribute('width', rect.width.toString());
      if (!svg.getAttribute('height')) svg.setAttribute('height', rect.height.toString());
    }

    const style = window.getComputedStyle(svg);
    if (!svg.getAttribute('fill') && style.fill !== 'none') svg.setAttribute('fill', style.fill);
    if (!svg.getAttribute('stroke') && style.stroke !== 'none') svg.setAttribute('stroke', style.stroke);
    
    svg.querySelectorAll('path').forEach((path) => {
      const pathStyle = window.getComputedStyle(path);
      if (pathStyle.fill !== 'none') path.setAttribute('fill', pathStyle.fill);
      if (pathStyle.stroke !== 'none') path.setAttribute('stroke', pathStyle.stroke);
      if (pathStyle.strokeWidth !== '0px') path.setAttribute('stroke-width', pathStyle.strokeWidth);
    });
  });
};

export const generatePDFFromIframe = async (
  iframe: HTMLIFrameElement, 
  config: PDFConfig,
  fileName: string = 'pdflow-document.pdf'
): Promise<void> => {
  const contentWindow = iframe.contentWindow;
  const contentDocument = iframe.contentDocument;
  
  if (!contentWindow || !contentDocument) {
    throw new Error("Iframe content not accessible");
  }

  const { jsPDF } = jspdf;
  const pdf = new jsPDF({
    orientation: config.orientation,
    unit: 'mm',
    format: config.size,
    compress: true
  });

  const pdfWidthMm = pdf.internal.pageSize.getWidth();
  const pdfHeightMm = pdf.internal.pageSize.getHeight();
  
  // Calculate the target width in pixels for the layout engine
  // This ensures the layout doesn't reflow differently from the screen
  const targetWidthPx = mmToPx(pdfWidthMm);
  
  const element = contentDocument.body; // Target body for cleaner capture
  const originalScrollY = contentWindow.scrollY;
  const originalWidth = element.style.width;
  
  // Force the layout to match the PDF width exactly during capture
  element.style.width = `${targetWidthPx}px`;
  contentWindow.scrollTo(0, 0);

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // 2x is usually the sweet spot for balance between quality and memory
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: targetWidthPx, // Force capture width
      windowWidth: targetWidthPx, // Force window width for media queries
      scrollY: -window.scrollY, // Fix for offset issues
      onclone: (clonedDoc: Document) => {
        const clonedRoot = clonedDoc.body;
        clonedRoot.style.width = `${targetWidthPx}px`;
        clonedRoot.style.overflow = 'visible';
        
        // Remove common interactive elements or artifacts
        clonedRoot.querySelectorAll('.no-print').forEach(el => (el as HTMLElement).style.display = 'none');
        
        fixSVGs(clonedRoot);
        
        // Ensure all images are ready
        clonedRoot.querySelectorAll('img').forEach(img => {
          img.style.opacity = '1';
          img.style.visibility = 'visible';
        });
      }
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.90);
    const imgProps = pdf.getImageProperties(imgData);
    
    // Calculate final image height in PDF units (mm)
    const totalImgHeightInPdfUnits = (imgProps.height * pdfWidthMm) / imgProps.width;

    let heightLeft = totalImgHeightInPdfUnits;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidthMm, totalImgHeightInPdfUnits, undefined, 'FAST');
    heightLeft -= pdfHeightMm;

    // Subsequent pages
    while (heightLeft > 0) {
      position -= pdfHeightMm;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidthMm, totalImgHeightInPdfUnits, undefined, 'FAST');
      heightLeft -= pdfHeightMm;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error("PDF Export Error:", error);
    throw error;
  } finally {
    // Restore styles and scroll
    element.style.width = originalWidth;
    contentWindow.scrollTo(0, originalScrollY);
  }
};
