import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const guidesPath = path.join(process.cwd(), 'src/data/guides.json');
  if (!fs.existsSync(guidesPath)) return [];
  const guides = JSON.parse(fs.readFileSync(guidesPath, 'utf-8'));
  return guides.map((g: any) => ({ id: g.id }));
}

export default function GuidePage({ params }: { params: any }) {
  const { id } = params;
  const guidesPath = path.join(process.cwd(), 'src/data/guides.json');
  if (!fs.existsSync(guidesPath)) return notFound();
  
  const guides: any[] = JSON.parse(fs.readFileSync(guidesPath, 'utf-8'));
  const guide = guides.find((g: any) => g.id === id);
  if (!guide) return notFound();

  return (
    <div className="wiki-container" style={{ background: '#f5f5f5', minHeight: '100vh', padding: '40px 0' }}>
      <div className="inner" style={{ maxWidth: '960px', margin: '0 auto', background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Link href="/wiki/guides" style={{ display: 'inline-block', marginBottom: '20px', color: '#0070f3', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Back to All Guides
        </Link>
        <div 
          className="guide-html-content"
          dangerouslySetInnerHTML={{ __html: guide.content }} 
        />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .guide-html-content {
          color: #333;
          line-height: 1.8;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .guide-html-content h1 { font-size: 2.2em; border-bottom: 2px solid #eaeaea; padding-bottom: 10px; margin-bottom: 30px; color: #111; }
        .guide-html-content h2 { font-size: 1.6em; margin-top: 40px; margin-bottom: 15px; color: #0070f3; border-left: 4px solid #0070f3; padding-left: 12px; }
        .guide-html-content h3 { font-size: 1.3em; margin-top: 25px; margin-bottom: 10px; color: #222; }
        .guide-html-content p, .guide-html-content li { color: #444; margin-bottom: 12px; }
        .guide-html-content ul, .guide-html-content ol { padding-left: 24px; margin-bottom: 20px; }
        .guide-html-content a { color: #0070f3; text-decoration: none; }
        .guide-html-content a:hover { text-decoration: underline; }
        .guide-html-content table { width: 100%; border-collapse: collapse; margin: 20px 0 30px; font-size: 0.95em; }
        .guide-html-content th, .guide-html-content td { border: 1px solid #eaeaea; padding: 10px 14px; text-align: left; }
        .guide-html-content th { background: #fafafa; color: #111; font-weight: 600; }
        .guide-html-content tr:hover td { background: #f9f9f9; }
        .guide-html-content .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 0.85em; font-weight: 600; margin: 2px; }
        .guide-html-content .badge-green { background: #e6ffed; color: #1a7f37; border: 1px solid #1a7f37; }
        .guide-html-content .badge-gold { background: #fff8c5; color: #9a6700; border: 1px solid #9a6700; }
        .guide-html-content .badge-red { background: #ffebe9; color: #cf222e; border: 1px solid #cf222e; }
        .guide-html-content .badge-purple { background: #fbeaff; color: #8250df; border: 1px solid #8250df; }
        .guide-html-content .badge-blue { background: #ddf4ff; color: #0969da; border: 1px solid #0969da; }
        .guide-html-content .info-box { background: #f8f9fa; border: 1px solid #e9ecef; border-left: 4px solid #0070f3; border-radius: 4px; padding: 16px; margin: 20px 0; }
        .guide-html-content .toc { background: #fafafa; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px; margin-bottom: 30px; }
        .guide-html-content .cmd { background: #f3f3f3; color: #d73a49; padding: 3px 6px; border-radius: 4px; font-family: 'Consolas', monospace; font-size: 0.9em; border: 1px solid #e1e4e8; }
        .guide-html-content .dungeon-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin: 15px 0; }
        .guide-html-content .dungeon-list li { list-style: none; background: #fff; border: 1px solid #eaeaea; padding: 10px; border-radius: 6px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
      `}} />
    </div>
  );
}
