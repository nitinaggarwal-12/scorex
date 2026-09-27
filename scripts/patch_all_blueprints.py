import json

with open('scratch/03_lakehouse_target_state_biglake_omni.drawio.xml', 'r') as f:
    lakehouse_xml = f.read()

with open('scratch/04_finops_target_state_chargeback.drawio.xml', 'r') as f:
    finops_xml = f.read()

with open('scratch/02_genai_target_state_mcp_mesh.drawio.xml', 'r') as f:
    agentic_xml = f.read()

# 1. Update data/dynamic_assessments.json
with open('data/dynamic_assessments.json', 'r') as f:
    dyn_data = json.load(f)

# Lakehouse demo
for k in ['inst_edw_lakehouse_to_bigquery_modernization_demo', 'inst_enterprise_data_ai_maturity_demo']:
    if k in dyn_data:
        if 'architectureDiagrams' in dyn_data[k]:
            dyn_data[k]['architectureDiagrams']['targetStateXml'] = lakehouse_xml
        if 'aiReport' in dyn_data[k] and 'architectureDiagrams' in dyn_data[k]['aiReport']:
            dyn_data[k]['aiReport']['architectureDiagrams']['targetStateXml'] = lakehouse_xml

# FinOps demo
if 'inst_finops_cloud_cost_optimization_demo' in dyn_data:
    k = 'inst_finops_cloud_cost_optimization_demo'
    if 'architectureDiagrams' in dyn_data[k]:
        dyn_data[k]['architectureDiagrams']['targetStateXml'] = finops_xml
    if 'aiReport' in dyn_data[k] and 'architectureDiagrams' in dyn_data[k]['aiReport']:
        dyn_data[k]['aiReport']['architectureDiagrams']['targetStateXml'] = finops_xml

# Agentic demo
if 'inst_agentic_ai_mesh_mcp_banking_readiness_demo' in dyn_data:
    k = 'inst_agentic_ai_mesh_mcp_banking_readiness_demo'
    if 'architectureDiagrams' in dyn_data[k]:
        dyn_data[k]['architectureDiagrams']['targetStateXml'] = agentic_xml
    if 'aiReport' in dyn_data[k] and 'architectureDiagrams' in dyn_data[k]['aiReport']:
        dyn_data[k]['aiReport']['architectureDiagrams']['targetStateXml'] = agentic_xml

with open('data/dynamic_assessments.json', 'w') as f:
    json.dump(dyn_data, f, indent=2)
print("Updated data/dynamic_assessments.json for all three blueprints!")

# 2. Patch server & client masterBlueprintCatalog.js
for path in ['server/services/masterBlueprintCatalog.js', 'client/src/services/masterBlueprintCatalog.js']:
    with open(path, 'r') as f:
        content = f.read()

    # Patch buildPristineFinopsXml
    finops_func = 'function buildPristineFinopsXml() {\n  return `' + finops_xml.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${') + '`;\n}'
    # Find start and end of buildPristineFinopsXml
    start_finops = content.find('function buildPristineFinopsXml() {')
    end_finops = content.find('function buildCompleteWellArchitectedGcpDrMasterXml() {')
    if start_finops != -1 and end_finops != -1:
        content = content[:start_finops] + finops_func + '\n\n' + content[end_finops:]
        print(f"Patched buildPristineFinopsXml in {path}")

    # Patch buildHubAndSpokeAgentConfigXml
    agentic_func = 'function buildHubAndSpokeAgentConfigXml() {\n  return `' + agentic_xml.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${') + '`;\n}'
    start_agentic = content.find('function buildHubAndSpokeAgentConfigXml() {')
    end_agentic = content.find('function buildMcpContextGatewayXml() {')
    if start_agentic != -1 and end_agentic != -1:
        content = content[:start_agentic] + agentic_func + '\n\n' + content[end_agentic:]
        print(f"Patched buildHubAndSpokeAgentConfigXml in {path}")

    with open(path, 'w') as f:
        f.write(content)

print("All masterBlueprintCatalog files successfully updated!")
