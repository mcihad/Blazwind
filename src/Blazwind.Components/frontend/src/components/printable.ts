/**
 * Printable - Print utility for generating printable content
 */

export interface PrintOptions {
    title?: string;
    pageSize?: 'A4' | 'A5' | 'Letter' | 'Legal';
    orientation?: 'portrait' | 'landscape';
    margin?: string;
    headerHtml?: string;
    footerHtml?: string;
    showPageNumbers?: boolean;
    styles?: string;
}

export function print(element: HTMLElement, options: PrintOptions = {}): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        console.error('[BwPrintable] Could not open print window');
        return;
    }

    const pageSize = options.pageSize || 'A4';
    const orientation = options.orientation || 'portrait';
    const margin = options.margin || '20mm';

    const styles = `
        @page {
            size: ${pageSize} ${orientation};
            margin: ${margin};
        }
        
        @media print {
            body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            .no-print {
                display: none !important;
            }
            
            .page-break {
                page-break-before: always;
            }
            
            .page-break-after {
                page-break-after: always;
            }
            
            .avoid-break {
                page-break-inside: avoid;
            }
        }
        
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.5;
            color: #111827;
            margin: 0;
            padding: 0;
        }
        
        table {
            border-collapse: collapse;
            width: 100%;
        }
        
        th, td {
            border: 1px solid #e5e7eb;
            padding: 8px 12px;
            text-align: left;
        }
        
        th {
            background-color: #f9fafb;
            font-weight: 600;
        }
        
        .header {
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 16px;
            margin-bottom: 24px;
        }
        
        .footer {
            border-top: 1px solid #e5e7eb;
            padding-top: 16px;
            margin-top: 24px;
            font-size: 12px;
            color: #6b7280;
        }
        
        ${options.styles || ''}
    `;

    const headerHtml = options.headerHtml || '';
    const footerHtml = options.footerHtml || '';

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>${options.title || 'Yazdır'}</title>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>${styles}</style>
        </head>
        <body>
            ${headerHtml ? `<div class="header">${headerHtml}</div>` : ''}
            ${element.innerHTML}
            ${footerHtml ? `<div class="footer">${footerHtml}</div>` : ''}
            ${options.showPageNumbers ? `
                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    };
                </script>
            ` : `
                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    };
                </script>
            `}
        </body>
        </html>
    `);

    printWindow.document.close();
}

export function getElementHtml(element: HTMLElement): string {
    return element.innerHTML;
}

export function exportToPdf(element: HTMLElement, filename: string, options: PrintOptions = {}): void {
    // For PDF export, we use print-to-PDF functionality
    // This is a simplified version - for full PDF support, use jsPDF
    console.log(`[BwPrintable] Exporting to PDF: ${filename}`);
    print(element, options);
}
