import os
import re

with open('scratch/03_lakehouse_target_state_biglake_omni.drawio.xml', 'r') as f:
    drawio_xml = f.read()

escaped_xml = drawio_xml.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')

replacement_func = f"""function buildDataLakehouseXml() {{
  return `{escaped_xml}`;
}}"""

target_files = [
    'server/services/masterBlueprintCatalog.js',
    'client/src/services/masterBlueprintCatalog.js'
]

for file_path in target_files:
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            lines = f.readlines()
        
        start_idx = None
        end_idx = None
        for i, line in enumerate(lines):
            if line.startswith('function buildDataLakehouseXml()'):
                start_idx = i
            elif start_idx is not None and line.startswith('function buildGcpDataLakehouseWbsXml()'):
                end_idx = i
                break
        
        if start_idx is not None and end_idx is not None:
            new_lines = lines[:start_idx] + [replacement_func + '\n\n'] + lines[end_idx:]
            with open(file_path, 'w') as f:
                f.writelines(new_lines)
            print(f"Successfully patched {file_path} (replaced lines {start_idx+1} to {end_idx})")
        else:
            print(f"Could not find boundary in {file_path}: start={start_idx}, end={end_idx}")

