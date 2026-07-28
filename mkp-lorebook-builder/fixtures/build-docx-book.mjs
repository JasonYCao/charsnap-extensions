// Build a minimal but genuine .docx (OOXML zip) to exercise the DOCX import path.
import JSZip from 'jszip';
import { writeFileSync } from 'node:fs';

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

const RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

const heading = (text) =>
  `<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>${text}</w:t></w:r></w:p>`;
const para = (text) => `<w:p><w:r><w:t xml:space="preserve">${text}</w:t></w:r></w:p>`;

const DOCUMENT = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>
${heading('Aurelia Vance')}
${para('A weathered starship captain who speaks in clipped sentences and never removes her flight jacket.')}
${para('Triggers: aurelia, vance, captain')}
${heading('The Gilded Compass')}
${para('A brass navigation device that points toward whatever its holder most wants to avoid.')}
${para('Triggers: compass, gilded compass')}
${heading('Harbor Station')}
${para('A cramped orbital waypoint where three trade routes meet and nobody stays long.')}
${para('Triggers: harbor, station, docks')}
</w:body>
</w:document>`;

const zip = new JSZip();
zip.file('[Content_Types].xml', CONTENT_TYPES);
zip.folder('_rels').file('.rels', RELS);
zip.folder('word').file('document.xml', DOCUMENT);

const buf = await zip.generateAsync({ type: 'nodebuffer' });
writeFileSync(process.argv[2], buf);
console.log(`wrote ${process.argv[2]} (${buf.length} bytes, 3 entries)`);
