"use strict";
// Uncompressed ZIP records use little-endian fields and UTF-8 filenames.
function makeZip(files){
  const encoder = new TextEncoder();
  const parts = [], directory = [];
  let offset = 0, centralSize = 0;
  function crc32(bytes){
    let crc = -1;
    for(const byte of bytes){
      crc ^= byte;
      for(let bit=0;bit<8;bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
    return (crc ^ -1) >>> 0;
  }
  function record(fields){
    const bytes = new Uint8Array(fields.reduce((n,[size])=>n+size,0));
    const view = new DataView(bytes.buffer);
    let pos = 0;
    for(const [size,value] of fields){
      if(size===2) view.setUint16(pos,value,true);
      else view.setUint32(pos,value,true);
      pos += size;
    }
    return bytes;
  }
  for(const [path,source] of Object.entries(files)){
    const name = encoder.encode(path), data = encoder.encode(source);
    const common = [[2,20],[2,0x800],[2,0],[2,0],[2,33],[4,crc32(data)],[4,data.length],[4,data.length],[2,name.length],[2,0]];
    const local = record([[4,0x04034b50],...common]);
    const central = record([[4,0x02014b50],[2,20],...common,[2,0],[2,0],[2,0],[4,0],[4,offset]]);
    parts.push(local,name,data); directory.push(central,name);
    offset += local.length + name.length + data.length;
    centralSize += central.length + name.length;
  }
  const count = Object.keys(files).length;
  const end = record([[4,0x06054b50],[2,0],[2,0],[2,count],[2,count],[4,centralSize],[4,offset],[2,0]]);
  return new Blob([...parts,...directory,end],{type:"application/zip"});
}
