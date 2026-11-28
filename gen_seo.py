import base64, datetime, html, io, json, os, re, urllib.request
SITE = 'https://g77577076-hue.github.io/blok-site/'
FS = 'https://firestore.googleapis.com/v1/projects/blok-store/databases/(default)/documents/products?pageSize=100'
docs = json.load(urllib.request.urlopen(FS, timeout=30)).get('documents', [])
tpl = open('seo-template.html', encoding='utf-8').read()
urls = [(SITE, '1.0')]
changed = False

def write(path, text):
    global changed
    old = open(path, encoding='utf-8').read() if os.path.exists(path) else None
    if old != text:
        open(path, 'w', encoding='utf-8').write(text)
        changed = True
        print('wrote', path)

def img_name(code):
    known = {'BLOK-60': 'blok60-og.jpg', 'BLOK-67': 'blok67-og.jpg'}
    return known.get(code, code.lower().replace('-', '') + '-og.jpg')

for d in docs:
    f = d.get('fields', {})
    if (f.get('active') or {}).get('booleanValue') is False:
        continue
    code = (f.get('code') or {}).get('stringValue') or d['name'].split('/')[-1]
    if not re.fullmatch(r'[A-Za-z0-9-]+', code or ''):
        continue
    try:
        j = json.loads((f.get('data') or {}).get('stringValue') or '{}')
    except Exception:
        j = {}
    name = (j.get('name') or '').strip()
    if not name:
        continue
    base = float(j.get('price') or 0)
    sale = float(j.get('salePrice') or 0)
    price = int(sale if 0 < sale < base else base)
    stock = ((f.get('stock') or {}).get('mapValue') or {}).get('fields') or {}
    total = sum(int(v.get('integerValue', 0)) for v in stock.values())
    track = (f.get('track') or {}).get('booleanValue') is True
    avail = 'https://schema.org/OutOfStock' if (track and total <= 0) else 'https://schema.org/InStock'
    img = img_name(code)
    if not os.path.exists(img):
        thumb = (f.get('thumb') or {}).get('stringValue') or ''
        m = re.match(r'data:image/[^;]+;base64,(.*)$', thumb, re.S)
        if m:
            from PIL import Image
            im = Image.open(io.BytesIO(base64.b64decode(m.group(1)))).convert('RGB')
            im.thumbnail((1200, 1200))
            im.save(img, 'JPEG', quality=85)
            changed = True
            print('wrote', img)
        else:
            img = 'blok67-og.jpg'
    page = (tpl.replace('{{NAMEJ}}', json.dumps(name, ensure_ascii=False)[1:-1])
               .replace('{{NAME}}', html.escape(name, quote=True))
               .replace('{{CODE}}', code).replace('{{IMG}}', img)
               .replace('{{PRICE}}', str(price)).replace('{{AVAIL}}', avail))
    write(code + '.html', page)
    urls.append((SITE + code + '.html', '0.8'))

if len(urls) < 2:
    raise SystemExit('no products found, keeping old files')
today = datetime.date.today().isoformat()
out = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
for u, p in sorted(urls, key=lambda x: (x[1] != '1.0', x[0])):
    out += '<url><loc>%s</loc><lastmod>%s</lastmod><changefreq>weekly</changefreq><priority>%s</priority></url>' % (u, today, p)
out += '</urlset>\n'
old = open('sitemap.xml', encoding='utf-8').read() if os.path.exists('sitemap.xml') else ''
strip = lambda s: re.sub(r'<lastmod>[^<]*</lastmod>', '', s)
if strip(old) != strip(out):
    open('sitemap.xml', 'w', encoding='utf-8').write(out)
    changed = True
    print('wrote sitemap.xml')
print('changed' if changed else 'no changes')
