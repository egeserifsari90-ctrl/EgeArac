"""Read the exported HTML as data and package it with the Android app."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import shutil
import xml.etree.ElementTree as ET

class Head(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_title = False
        self.finished = False
        self.title = ""
        self.package = "studio.atolye.uygulamam"

    def handle_starttag(self, tag, attrs):
        if self.finished:
            return
        self.in_title = self.in_title or tag == "title"
        if tag == "meta":
            attrs = dict(attrs)
            candidate = attrs.get("content") or ""
            if attrs.get("name") == "atolye-paket" and re.fullmatch(r"studio\.atolye\.p[a-z0-9]{6,40}", candidate):
                self.package = candidate

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag == "head":
            self.finished = True

    def handle_data(self, data):
        if self.in_title and not self.finished:
            self.title += data

android = Path(__file__).resolve().parent
source = android.parent / "girdi/index.html"
head = Head()
head.feed(source.read_text(encoding="utf-8-sig"))
name = "".join(ch for ch in head.title if ch.isprintable()).strip()[:60] or "Atölye uygulaması"
main = android / "app/src/main"
assets = main / "assets"
assets.mkdir(exist_ok=True)
shutil.copyfile(source, assets / "index.html")
values = main / "res/values"
values.mkdir(parents=True, exist_ok=True)
resources = ET.Element("resources")
# Android string resources process backslashes and quotes after XML decoding.
escaped = name.replace(chr(92), chr(92) * 2).replace('"', chr(92) + '"').replace("'", chr(92) + "'")
ET.SubElement(resources, "string", name="app_name", formatted="false").text = '"' + escaped + '"'
ET.ElementTree(resources).write(values / "strings.xml", encoding="utf-8", xml_declaration=True)
(android / "app-metadata.json").write_text(json.dumps({"packageName": head.package}), encoding="utf-8")
