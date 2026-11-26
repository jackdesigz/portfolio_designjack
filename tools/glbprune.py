"""glbprune.py in.glb out.glb nodo1,nodo2 — toglie dalla scena i nodi indicati e tutto ciò che resta inutilizzato."""
import json, struct, sys
src, dst, drop = sys.argv[1], sys.argv[2], set(sys.argv[3].split(','))
f = open(src, 'rb').read()
jlen, = struct.unpack('<I', f[12:16]); j = json.loads(f[20:20+jlen])
boff = 20 + jlen; blen, = struct.unpack('<I', f[boff:boff+4]); binc = f[boff+8:boff+8+blen]
# nodi raggiungibili
keep_nodes = []
def walk(i):
    n = j['nodes'][i]
    if n.get('name') in drop: return
    keep_nodes.append(i)
    for c in n.get('children', []): walk(c)
for sc in j['scenes']:
    for i in sc['nodes']: walk(i)
used = {k: set() for k in ['meshes','materials','textures','images','samplers','accessors','bufferViews']}
for i in keep_nodes:
    n = j['nodes'][i]
    if 'mesh' in n: used['meshes'].add(n['mesh'])
for m in used['meshes']:
    for p in j['meshes'][m]['primitives']:
        used['accessors'].update(p['attributes'].values())
        if 'indices' in p: used['accessors'].add(p['indices'])
        if 'material' in p: used['materials'].add(p['material'])
        for t in p.get('targets', []): used['accessors'].update(t.values())
def texrefs(o):
    if isinstance(o, dict):
        if 'index' in o and ('texCoord' in o or len(o) <= 3): yield o
        for v in o.values(): yield from texrefs(v)
for m in used['materials']:
    for r in texrefs(j['materials'][m]): used['textures'].add(r['index'])
for t in used['textures']:
    tx = j['textures'][t]
    if 'source' in tx: used['images'].add(tx['source'])
    if 'sampler' in tx: used['samplers'].add(tx['sampler'])
for a in used['accessors']:
    if 'bufferView' in j['accessors'][a]: used['bufferViews'].add(j['accessors'][a]['bufferView'])
for im in used['images']:
    if 'bufferView' in j['images'][im]: used['bufferViews'].add(j['images'][im]['bufferView'])
maps = {k: {old: new for new, old in enumerate(sorted(v))} for k, v in used.items()}
nmap = {old: new for new, old in enumerate(sorted(keep_nodes))}
# nuovo buffer
out = bytearray(); bvs = []
for old in sorted(used['bufferViews']):
    bv = dict(j['bufferViews'][old]); s = bv.get('byteOffset', 0)
    while len(out) % 4: out += b'\0'
    bv['byteOffset'] = len(out); out += binc[s:s+bv['byteLength']]; bvs.append(bv)
while len(out) % 4: out += b'\0'
nj = dict(j)
nj['bufferViews'] = bvs
nj['buffers'] = [{'byteLength': len(out)}]
acc = []
for old in sorted(used['accessors']):
    a = dict(j['accessors'][old])
    if 'bufferView' in a: a['bufferView'] = maps['bufferViews'][a['bufferView']]
    acc.append(a)
nj['accessors'] = acc
ims = []
for old in sorted(used['images']):
    im = dict(j['images'][old])
    if 'bufferView' in im: im['bufferView'] = maps['bufferViews'][im['bufferView']]
    ims.append(im)
nj['images'] = ims
nj['samplers'] = [j['samplers'][o] for o in sorted(used['samplers'])]
txs = []
for old in sorted(used['textures']):
    t = dict(j['textures'][old])
    if 'source' in t: t['source'] = maps['images'][t['source']]
    if 'sampler' in t: t['sampler'] = maps['samplers'][t['sampler']]
    txs.append(t)
nj['textures'] = txs
mats = []
def remap_tex(o):
    if isinstance(o, dict):
        o = {k: remap_tex(v) for k, v in o.items()}
        if 'index' in o and isinstance(o['index'], int) and ('texCoord' in o or len(o) <= 3) and o['index'] in maps['textures']:
            o['index'] = maps['textures'][o['index']]
        return o
    if isinstance(o, list): return [remap_tex(v) for v in o]
    return o
for old in sorted(used['materials']): mats.append(remap_tex(j['materials'][old]))
nj['materials'] = mats
meshes = []
for old in sorted(used['meshes']):
    m = json.loads(json.dumps(j['meshes'][old]))
    for p in m['primitives']:
        p['attributes'] = {k: maps['accessors'][v] for k, v in p['attributes'].items()}
        if 'indices' in p: p['indices'] = maps['accessors'][p['indices']]
        if 'material' in p: p['material'] = maps['materials'][p['material']]
        if 'targets' in p: p['targets'] = [{k: maps['accessors'][v] for k, v in t.items()} for t in p['targets']]
    meshes.append(m)
nj['meshes'] = meshes
nodes = []
for old in sorted(keep_nodes):
    n = dict(j['nodes'][old])
    if 'mesh' in n: n['mesh'] = maps['meshes'][n['mesh']]
    if 'children' in n: n['children'] = [nmap[c] for c in n['children'] if c in nmap]
    nodes.append(n)
nj['nodes'] = nodes
nj['scenes'] = [dict(sc, nodes=[nmap[i] for i in sc['nodes'] if i in nmap]) for sc in j['scenes']]
for k in ['skins', 'animations']:
    if k in nj and nj[k]: raise SystemExit('skins/animations non gestiti')
js = json.dumps(nj, separators=(',', ':')).encode()
while len(js) % 4: js += b' '
total = 12 + 8 + len(js) + 8 + len(out)
with open(dst, 'wb') as o:
    o.write(struct.pack('<4sII', b'glTF', 2, total))
    o.write(struct.pack('<I4s', len(js), b'JSON')); o.write(js)
    o.write(struct.pack('<I4s', len(out), b'BIN\0')); o.write(out)
print('ok', total, 'byte; nodi', [n.get('name') for n in nodes])
