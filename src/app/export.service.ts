import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  exportToCSV(data: any[], filename: string) {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => 
        JSON.stringify(row[header] || '')
      ).join(','))
    ].join('\\n');

    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  }

  exportToJSON(data: any[], filename: string) {
    const jsonContent = JSON.stringify(data, null, 2);
    this.downloadFile(jsonContent, `${filename}.json`, 'application/json');
  }

  exportToPDF(content: string, filename: string) {
    // Simple PDF generation - in production, use libraries like jsPDF
    const pdfContent = `
      <html>
        <head><title>${filename}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          ${content}
        </body>
      </html>
    `;
    
    const blob = new Blob([pdfContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.html`;
    link.click();
    URL.revokeObjectURL(url);
  }

  private downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Export blog posts
  exportBlogPosts(posts: any[]) {
    const exportData = posts.map(post => ({
      title: post.title,
      date: post.date,
      excerpt: post.excerpt,
      content: post.content || ''
    }));
    
    this.exportToCSV(exportData, 'blog-posts');
  }

  // Export media items
  exportMediaItems(items: any[]) {
    const exportData = items.map(item => ({
      title: item.title,
      type: item.type,
      category: item.category
    }));
    
    this.exportToJSON(exportData, 'media-items');
  }
}