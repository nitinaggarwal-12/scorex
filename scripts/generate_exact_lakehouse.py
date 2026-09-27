import os
import json

def generate_lakehouse_xml():
    xml = """<mxfile host="app.diagrams.net" modified="2026-09-09T17:50:00.000Z" agent="ScoreX Enterprise Architecture Engine" version="24.7.5">
  <diagram id="lakehouse_target_state_biglake_omni" name="Target State: GCP Enterprise Data Lakehouse &amp; BigLake Medallion Mesh">
    <mxGraphModel dx="1600" dy="920" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1600" pageHeight="920" background="#0B111E" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>

        <!-- MAIN TITLE -->
        <mxCell id="main_title" value="&lt;b style=&quot;font-size:28px;color:#FFFFFF;letter-spacing:-0.5px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;&quot;&gt;Target State: GCP Enterprise Data Lakehouse &amp;amp; BigLake Medallion Mesh&lt;/b&gt;" style="text;html=1;align=left;verticalAlign=middle;strokeColor=none;fillColor=none;" vertex="1" parent="1">
          <mxGeometry x="40" y="32" width="1200" height="40" as="geometry"/>
        </mxCell>

        <!-- ========================================================================= -->
        <!-- ROW 1: 1. Real-Time Streaming Ingestion                                   -->
        <!-- ========================================================================= -->
        <mxCell id="row1_box" value="" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#101827;strokeColor=#1E293B;strokeWidth=1.5;arcSize=8;" vertex="1" parent="1">
          <mxGeometry x="40" y="95" width="1520" height="170" as="geometry"/>
        </mxCell>
        <mxCell id="lbl_row1" value="&lt;b style=&quot;font-size:16px;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;&quot;&gt;1. Real-Time&lt;br&gt;&amp;nbsp;&amp;nbsp;&amp;nbsp;Streaming Ingestion&lt;/b&gt;" style="text;html=1;align=left;verticalAlign=middle;strokeColor=none;fillColor=none;" vertex="1" parent="1">
          <mxGeometry x="60" y="145" width="180" height="60" as="geometry"/>
        </mxCell>
        <!-- Arrow from row 1 label to PubSub -->
        <mxCell id="e_lbl_pubsub" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#52617A;strokeWidth=1.5;endArrow=classic;endFill=1;" edge="1" parent="1" source="lbl_row1" target="card_pubsub">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <!-- Card: Google Cloud Pub/Sub -->
        <mxCell id="card_pubsub" value="&lt;table cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; style=&quot;width:100%;height:100%;&quot;&gt;&lt;tr&gt;&lt;td style=&quot;width:40px;text-align:center;vertical-align:middle;&quot;&gt;&lt;div style=&quot;width:32px;height:32px;border-radius:50%;background:#1E293B;display:flex;align-items:center;justify-content:center;font-size:18px;color:#38BDF8;&quot;&gt;🌐&lt;/div&gt;&lt;/td&gt;&lt;td style=&quot;padding-left:12px;vertical-align:middle;&quot;&gt;&lt;b style=&quot;font-size:15px;color:#FFFFFF;&quot;&gt;Google Cloud&lt;br&gt;Pub/Sub&lt;/b&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#182234;strokeColor=#2E3D56;strokeWidth=1.5;align=left;verticalAlign=middle;padding=8;arcSize=10;" vertex="1" parent="1">
          <mxGeometry x="270" y="140" width="220" height="80" as="geometry"/>
        </mxCell>

        <!-- Value Badge: Sub-Second CDC Streaming -->
        <mxCell id="badge_cdc" value="&lt;b style=&quot;font-size:12px;color:#34D399;&quot;&gt;✓ Sub-Second CDC Streaming&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064E3B;strokeColor=#10B981;strokeWidth=1.5;align=center;verticalAlign=middle;arcSize=50;" vertex="1" parent="1">
          <mxGeometry x="540" y="105" width="220" height="30" as="geometry"/>
        </mxCell>

        <!-- Card: Datastream CDC -->
        <mxCell id="card_datastream" value="&lt;table cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; style=&quot;width:100%;height:100%;&quot;&gt;&lt;tr&gt;&lt;td style=&quot;width:40px;text-align:center;vertical-align:middle;&quot;&gt;&lt;div style=&quot;width:32px;height:32px;border-radius:50%;background:#1E293B;display:flex;align-items:center;justify-content:center;font-size:18px;color:#38BDF8;&quot;&gt;🔄&lt;/div&gt;&lt;/td&gt;&lt;td style=&quot;padding-left:12px;vertical-align:middle;&quot;&gt;&lt;b style=&quot;font-size:15px;color:#FFFFFF;&quot;&gt;Datastream&lt;br&gt;CDC&lt;/b&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#182234;strokeColor=#2E3D56;strokeWidth=1.5;align=left;verticalAlign=middle;padding=8;arcSize=10;" vertex="1" parent="1">
          <mxGeometry x="540" y="140" width="220" height="80" as="geometry"/>
        </mxCell>

        <!-- Connector Pub/Sub -> Datastream with Circled 1 -->
        <mxCell id="e_pubsub_datastream" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#52617A;strokeWidth=1.5;endArrow=classic;endFill=1;" edge="1" parent="1" source="card_pubsub" target="card_datastream">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="step_circle_1" value="1" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#10B981;strokeColor=#10B981;fontColor=#0B111E;fontStyle=1;fontSize=11;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="502" y="171" width="18" height="18" as="geometry"/>
        </mxCell>

        <!-- Value Badge: Storage Write API / Omni Querying -->
        <mxCell id="badge_omni_top" value="&lt;b style=&quot;font-size:12px;color:#34D399;&quot;&gt;✓ Zero-Egress Multi-Cloud Querying (BigQuery Omni)&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064E3B;strokeColor=#10B981;strokeWidth=1.5;align=center;verticalAlign=middle;arcSize=50;" vertex="1" parent="1">
          <mxGeometry x="840" y="105" width="370" height="30" as="geometry"/>
        </mxCell>

        <!-- Card: BigQuery Storage Write API -->
        <mxCell id="card_storage_write" value="&lt;table cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; style=&quot;width:100%;height:100%;&quot;&gt;&lt;tr&gt;&lt;td style=&quot;width:40px;text-align:center;vertical-align:middle;&quot;&gt;&lt;div style=&quot;width:32px;height:32px;border-radius:50%;background:#1E293B;display:flex;align-items:center;justify-content:center;font-size:18px;color:#38BDF8;&quot;&gt;📊&lt;/div&gt;&lt;/td&gt;&lt;td style=&quot;padding-left:12px;vertical-align:middle;&quot;&gt;&lt;b style=&quot;font-size:15px;color:#FFFFFF;&quot;&gt;BigQuery&lt;br&gt;Storage Write API&lt;/b&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#182234;strokeColor=#2E3D56;strokeWidth=1.5;align=left;verticalAlign=middle;padding=8;arcSize=10;" vertex="1" parent="1">
          <mxGeometry x="840" y="140" width="240" height="80" as="geometry"/>
        </mxCell>

        <!-- Connector Datastream -> Storage Write API labeled Step 6 -->
        <mxCell id="e_datastream_write" value="&lt;span style=&quot;font-size:11px;color:#94A3B8;&quot;&gt;Step 6&lt;/span&gt;" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#52617A;strokeWidth=1.5;endArrow=classic;endFill=1;labelBackgroundColor=#0B111E;" edge="1" parent="1" source="card_datastream" target="card_storage_write">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>


        <!-- ========================================================================= -->
        <!-- ROW 2: 2. Open Medallion Storage & Catalog                                -->
        <!-- ========================================================================= -->
        <mxCell id="row2_box" value="" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#101827;strokeColor=#1E293B;strokeWidth=1.5;arcSize=8;" vertex="1" parent="1">
          <mxGeometry x="40" y="285" width="1520" height="180" as="geometry"/>
        </mxCell>
        <mxCell id="lbl_row2" value="&lt;b style=&quot;font-size:16px;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;&quot;&gt;2. Open Medallion&lt;br&gt;&amp;nbsp;&amp;nbsp;&amp;nbsp;Storage &amp;amp; Catalog&lt;/b&gt;" style="text;html=1;align=left;verticalAlign=middle;strokeColor=none;fillColor=none;" vertex="1" parent="1">
          <mxGeometry x="60" y="340" width="180" height="60" as="geometry"/>
        </mxCell>

        <!-- Card: Cloud Storage Raw (Bronze) -->
        <mxCell id="card_raw" value="&lt;table cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; style=&quot;width:100%;height:100%;&quot;&gt;&lt;tr&gt;&lt;td style=&quot;width:36px;vertical-align:top;padding-top:4px;&quot;&gt;&lt;span style=&quot;font-size:24px;&quot;&gt;🪣&lt;/span&gt;&lt;/td&gt;&lt;td style=&quot;vertical-align:top;&quot;&gt;&lt;b style=&quot;font-size:15px;color:#FFFFFF;&quot;&gt;Cloud Storage&lt;br&gt;Raw&lt;/b&gt;&lt;br&gt;&lt;div style=&quot;margin-top:10px;display:flex;align-items:center;gap:4px;&quot;&gt;&lt;span style=&quot;font-size:11px;color:#94A3B8;&quot;&gt;Apache Iceberg&lt;/span&gt;&amp;nbsp;&lt;span style=&quot;font-size:14px;&quot;&gt;💎&lt;/span&gt;&lt;/div&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1C1917;strokeColor=#B45309;strokeWidth=2;align=left;verticalAlign=middle;padding=10;arcSize=10;" vertex="1" parent="1">
          <mxGeometry x="270" y="330" width="190" height="95" as="geometry"/>
        </mxCell>

        <!-- Connector Datastream -> Raw labeled Step 1 -->
        <mxCell id="e_stream_raw" value="&lt;span style=&quot;font-size:11px;color:#94A3B8;&quot;&gt;Step 1&lt;/span&gt;" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#52617A;strokeWidth=1.5;endArrow=classic;endFill=1;labelBackgroundColor=#0B111E;" edge="1" parent="1" source="card_datastream" target="card_raw">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="790" y="240"/>
              <mxPoint x="365" y="240"/>
            </Array>
          </mxGeometry>
        </mxCell>

        <!-- Card: Silver Enriched -->
        <mxCell id="card_silver" value="&lt;table cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; style=&quot;width:100%;height:100%;&quot;&gt;&lt;tr&gt;&lt;td style=&quot;width:36px;vertical-align:top;padding-top:4px;&quot;&gt;&lt;span style=&quot;font-size:24px;&quot;&gt;🪣&lt;/span&gt;&lt;/td&gt;&lt;td style=&quot;vertical-align:top;&quot;&gt;&lt;b style=&quot;font-size:15px;color:#FFFFFF;&quot;&gt;Silver&lt;br&gt;Enriched&lt;/b&gt;&lt;br&gt;&lt;div style=&quot;margin-top:10px;display:flex;align-items:center;gap:4px;&quot;&gt;&lt;span style=&quot;font-size:11px;color:#94A3B8;&quot;&gt;Apache Iceberg&lt;/span&gt;&amp;nbsp;&lt;span style=&quot;font-size:14px;&quot;&gt;💎&lt;/span&gt;&lt;/div&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1E293B;strokeColor=#64748B;strokeWidth=2;align=left;verticalAlign=middle;padding=10;arcSize=10;" vertex="1" parent="1">
          <mxGeometry x="510" y="330" width="190" height="95" as="geometry"/>
        </mxCell>

        <!-- Connector Raw -> Silver labeled Step 3 -->
        <mxCell id="e_raw_silver" value="&lt;span style=&quot;font-size:11px;color:#94A3B8;&quot;&gt;Step 3&lt;/span&gt;" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#52617A;strokeWidth=1.5;endArrow=classic;endFill=1;labelBackgroundColor=#0B111E;" edge="1" parent="1" source="card_raw" target="card_silver">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <!-- Card: Gold Aggregated -->
        <mxCell id="card_gold" value="&lt;table cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; style=&quot;width:100%;height:100%;&quot;&gt;&lt;tr&gt;&lt;td style=&quot;width:36px;vertical-align:top;padding-top:4px;&quot;&gt;&lt;span style=&quot;font-size:24px;&quot;&gt;🪣&lt;/span&gt;&lt;/td&gt;&lt;td style=&quot;vertical-align:top;&quot;&gt;&lt;b style=&quot;font-size:15px;color:#FFFFFF;&quot;&gt;Gold&lt;br&gt;Aggregated&lt;/b&gt;&lt;br&gt;&lt;div style=&quot;margin-top:10px;display:flex;align-items:center;gap:4px;&quot;&gt;&lt;span style=&quot;font-size:11px;color:#94A3B8;&quot;&gt;Apache Iceberg&lt;/span&gt;&amp;nbsp;&lt;span style=&quot;font-size:14px;&quot;&gt;💎&lt;/span&gt;&lt;/div&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#292008;strokeColor=#EAB308;strokeWidth=2;align=left;verticalAlign=middle;padding=10;arcSize=10;" vertex="1" parent="1">
          <mxGeometry x="750" y="330" width="190" height="95" as="geometry"/>
        </mxCell>

        <!-- Connector Silver -> Gold with Circled $ -->
        <mxCell id="e_silver_gold" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#52617A;strokeWidth=1.5;endArrow=classic;endFill=1;" edge="1" parent="1" source="card_silver" target="card_gold">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="step_circle_dollar" value="$" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#10B981;strokeColor=#10B981;fontColor=#0B111E;fontStyle=1;fontSize=11;align=center;verticalAlign=middle;" vertex="1" parent="1">
          <mxGeometry x="715" y="368" width="18" height="18" as="geometry"/>
        </mxCell>

        <!-- Value Badge: Apache Iceberg Open Table Formats -->
        <mxCell id="badge_iceberg" value="&lt;b style=&quot;font-size:12px;color:#34D399;&quot;&gt;✓ Apache Iceberg&lt;br&gt;&amp;nbsp;&amp;nbsp;&amp;nbsp;Open Table Formats&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#082F49;strokeColor=#0284C7;strokeWidth=1.5;align=center;verticalAlign=middle;arcSize=50;" vertex="1" parent="1">
          <mxGeometry x="990" y="295" width="220" height="34" as="geometry"/>
        </mxCell>

        <!-- Card: Dataplex Universal Catalog -->
        <mxCell id="card_dataplex" value="&lt;table cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; style=&quot;width:100%;height:100%;&quot;&gt;&lt;tr&gt;&lt;td style=&quot;width:40px;text-align:center;vertical-align:middle;&quot;&gt;&lt;div style=&quot;width:32px;height:32px;border-radius:50%;background:#1E293B;display:flex;align-items:center;justify-content:center;font-size:18px;color:#38BDF8;&quot;&gt;🕸️&lt;/div&gt;&lt;/td&gt;&lt;td style=&quot;padding-left:12px;vertical-align:middle;&quot;&gt;&lt;b style=&quot;font-size:15px;color:#FFFFFF;&quot;&gt;Dataplex&lt;br&gt;Universal Catalog&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10.5px;color:#94A3B8;&quot;&gt;Automated column masking&lt;br&gt;across thresn layers&lt;/span&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#182234;strokeColor=#2E3D56;strokeWidth=1.5;align=left;verticalAlign=middle;padding=8;arcSize=10;" vertex="1" parent="1">
          <mxGeometry x="990" y="335" width="260" height="90" as="geometry"/>
        </mxCell>

        <!-- Connector Gold -> Dataplex -->
        <mxCell id="e_gold_dataplex" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#52617A;strokeWidth=1.5;endArrow=classic;endFill=1;" edge="1" parent="1" source="card_gold" target="card_dataplex">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>


        <!-- ========================================================================= -->
        <!-- ROW 3: 3. High-Performance Compute & Multi-Cloud                          -->
        <!-- ========================================================================= -->
        <mxCell id="row3_box" value="" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#101827;strokeColor=#1E293B;strokeWidth=1.5;arcSize=8;" vertex="1" parent="1">
          <mxGeometry x="40" y="480" width="1520" height="180" as="geometry"/>
        </mxCell>
        <mxCell id="lbl_row3" value="&lt;b style=&quot;font-size:16px;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;&quot;&gt;3. High-Performance&lt;br&gt;&amp;nbsp;&amp;nbsp;&amp;nbsp;Compute &amp;amp;&lt;br&gt;&amp;nbsp;&amp;nbsp;&amp;nbsp;Multi-Cloud&lt;/b&gt;" style="text;html=1;align=left;verticalAlign=middle;strokeColor=none;fillColor=none;" vertex="1" parent="1">
          <mxGeometry x="60" y="535" width="180" height="70" as="geometry"/>
        </mxCell>

        <!-- Card: BigQuery Editions Autoscaling Slots -->
        <mxCell id="card_bq_editions" value="&lt;table cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; style=&quot;width:100%;height:100%;&quot;&gt;&lt;tr&gt;&lt;td style=&quot;width:40px;text-align:center;vertical-align:middle;&quot;&gt;&lt;div style=&quot;width:32px;height:32px;border-radius:50%;background:#1E293B;display:flex;align-items:center;justify-content:center;font-size:18px;color:#38BDF8;&quot;&gt;⚡&lt;/div&gt;&lt;/td&gt;&lt;td style=&quot;padding-left:12px;vertical-align:middle;&quot;&gt;&lt;b style=&quot;font-size:14.5px;color:#FFFFFF;&quot;&gt;BigQuery Editions&lt;br&gt;Autoscaling Slots&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10.5px;color:#94A3B8;&quot;&gt;Massive processing power&lt;/span&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#182234;strokeColor=#2E3D56;strokeWidth=1.5;align=left;verticalAlign=middle;padding=8;arcSize=10;" vertex="1" parent="1">
          <mxGeometry x="270" y="530" width="230" height="85" as="geometry"/>
        </mxCell>

        <!-- Connector Raw -> BigQuery Editions labeled Step 1 -->
        <mxCell id="e_raw_bq" value="&lt;span style=&quot;font-size:11px;color:#94A3B8;&quot;&gt;Step 1&lt;/span&gt;" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#52617A;strokeWidth=1.5;endArrow=classic;endFill=1;labelBackgroundColor=#0B111E;" edge="1" parent="1" source="card_raw" target="card_bq_editions">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <!-- Card: Dataproc Serverless Spark -->
        <mxCell id="card_spark" value="&lt;table cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; style=&quot;width:100%;height:100%;&quot;&gt;&lt;tr&gt;&lt;td style=&quot;width:40px;text-align:center;vertical-align:middle;&quot;&gt;&lt;div style=&quot;width:32px;height:32px;border-radius:50%;background:#1E293B;display:flex;align-items:center;justify-content:center;font-size:18px;color:#38BDF8;&quot;&gt;🔥&lt;/div&gt;&lt;/td&gt;&lt;td style=&quot;padding-left:12px;vertical-align:middle;&quot;&gt;&lt;b style=&quot;font-size:14.5px;color:#FFFFFF;&quot;&gt;Dataproc&lt;br&gt;Serverless Spark&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10.5px;color:#94A3B8;&quot;&gt;Managed Spark jobs&lt;/span&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#182234;strokeColor=#2E3D56;strokeWidth=1.5;align=left;verticalAlign=middle;padding=8;arcSize=10;" vertex="1" parent="1">
          <mxGeometry x="540" y="530" width="220" height="85" as="geometry"/>
        </mxCell>

        <!-- Connector BQ Editions -> Spark -->
        <mxCell id="e_bq_spark" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#52617A;strokeWidth=1.5;endArrow=classic;endFill=1;" edge="1" parent="1" source="card_bq_editions" target="card_spark">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <!-- Connector Silver -> Spark labeled Step 6 -->
        <mxCell id="e_silver_spark" value="&lt;span style=&quot;font-size:11px;color:#94A3B8;&quot;&gt;Step 6&lt;/span&gt;" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#52617A;strokeWidth=1.5;endArrow=classic;endFill=1;labelBackgroundColor=#0B111E;" edge="1" parent="1" source="card_silver" target="card_spark">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="640" y="470"/>
              <mxPoint x="640" y="470"/>
            </Array>
          </mxGeometry>
        </mxCell>

        <!-- Value Badge: Zero-Egress Multi-Cloud Querying (BigQuery Omni) -->
        <mxCell id="badge_omni_mid" value="&lt;b style=&quot;font-size:12px;color:#34D399;&quot;&gt;✓ Zero-Egress Multi-Cloud Querying&lt;br&gt;&amp;nbsp;&amp;nbsp;&amp;nbsp;(BigQuery Omni)&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064E3B;strokeColor=#10B981;strokeWidth=1.5;align=center;verticalAlign=middle;arcSize=50;" vertex="1" parent="1">
          <mxGeometry x="810" y="490" width="280" height="34" as="geometry"/>
        </mxCell>

        <!-- Card: BigQuery Omni -->
        <mxCell id="card_omni" value="&lt;table cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; style=&quot;width:100%;height:100%;&quot;&gt;&lt;tr&gt;&lt;td style=&quot;width:40px;text-align:center;vertical-align:middle;&quot;&gt;&lt;div style=&quot;width:32px;height:32px;border-radius:50%;background:#1E293B;display:flex;align-items:center;justify-content:center;font-size:18px;color:#38BDF8;&quot;&gt;🌐&lt;/div&gt;&lt;/td&gt;&lt;td style=&quot;padding-left:12px;vertical-align:middle;&quot;&gt;&lt;b style=&quot;font-size:14.5px;color:#FFFFFF;&quot;&gt;BigQuery Omni&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10.5px;color:#94A3B8;&quot;&gt;Zero-egress in-place&lt;br&gt;querying across data&lt;/span&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#182234;strokeColor=#2E3D56;strokeWidth=1.5;align=left;verticalAlign=middle;padding=8;arcSize=10;" vertex="1" parent="1">
          <mxGeometry x="810" y="530" width="240" height="85" as="geometry"/>
        </mxCell>

        <!-- Cards: AWS S3 & Azure ADLS -->
        <mxCell id="card_aws" value="&lt;table cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; style=&quot;width:100%;height:100%;&quot;&gt;&lt;tr&gt;&lt;td style=&quot;width:32px;text-align:center;&quot;&gt;&lt;span style=&quot;font-size:20px;color:#EA580C;&quot;&gt;🟧&lt;/span&gt;&lt;/td&gt;&lt;td style=&quot;padding-left:8px;&quot;&gt;&lt;b style=&quot;font-size:13px;color:#FFFFFF;&quot;&gt;AWS&lt;br&gt;S3&lt;/b&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1E293B;strokeColor=#EA580C;strokeWidth=1.5;align=left;verticalAlign=middle;padding=4;arcSize=10;" vertex="1" parent="1">
          <mxGeometry x="1100" y="515" width="120" height="46" as="geometry"/>
        </mxCell>
        <mxCell id="card_azure" value="&lt;table cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; style=&quot;width:100%;height:100%;&quot;&gt;&lt;tr&gt;&lt;td style=&quot;width:32px;text-align:center;&quot;&gt;&lt;span style=&quot;font-size:20px;color:#0284C7;&quot;&gt;🟦&lt;/span&gt;&lt;/td&gt;&lt;td style=&quot;padding-left:8px;&quot;&gt;&lt;b style=&quot;font-size:13px;color:#FFFFFF;&quot;&gt;Azure&lt;br&gt;ADLS&lt;/b&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1E293B;strokeColor=#0284C7;strokeWidth=1.5;align=left;verticalAlign=middle;padding=4;arcSize=10;" vertex="1" parent="1">
          <mxGeometry x="1100" y="570" width="120" height="46" as="geometry"/>
        </mxCell>

        <!-- Connectors Omni -> AWS & Azure -->
        <mxCell id="e_omni_aws" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#52617A;strokeWidth=1.5;endArrow=classic;endFill=1;" edge="1" parent="1" source="card_omni" target="card_aws">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        <mxCell id="e_omni_azure" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#52617A;strokeWidth=1.5;endArrow=classic;endFill=1;" edge="1" parent="1" source="card_omni" target="card_azure">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>


        <!-- ========================================================================= -->
        <!-- ROW 4: 4. Governed Consumption & BI                                       -->
        <!-- ========================================================================= -->
        <mxCell id="row4_box" value="" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#101827;strokeColor=#1E293B;strokeWidth=1.5;arcSize=8;" vertex="1" parent="1">
          <mxGeometry x="40" y="680" width="1520" height="180" as="geometry"/>
        </mxCell>
        <mxCell id="lbl_row4" value="&lt;b style=&quot;font-size:16px;color:#FFFFFF;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;&quot;&gt;4. Governed&lt;br&gt;&amp;nbsp;&amp;nbsp;&amp;nbsp;Consumption &amp;amp; BI&lt;/b&gt;" style="text;html=1;align=left;verticalAlign=middle;strokeColor=none;fillColor=none;" vertex="1" parent="1">
          <mxGeometry x="60" y="735" width="180" height="60" as="geometry"/>
        </mxCell>

        <!-- Value Badge: Governed Semantic Metric Layer -->
        <mxCell id="badge_looker" value="&lt;b style=&quot;font-size:12px;color:#34D399;&quot;&gt;✓ Governed Semantic Metric Layer&lt;/b&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#064E3B;strokeColor=#10B981;strokeWidth=1.5;align=center;verticalAlign=middle;arcSize=50;" vertex="1" parent="1">
          <mxGeometry x="270" y="690" width="270" height="30" as="geometry"/>
        </mxCell>

        <!-- Card: Looker Governed Semantic Metric Layer -->
        <mxCell id="card_looker" value="&lt;table cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; style=&quot;width:100%;height:100%;&quot;&gt;&lt;tr&gt;&lt;td style=&quot;width:40px;text-align:center;vertical-align:middle;&quot;&gt;&lt;div style=&quot;width:32px;height:32px;border-radius:50%;background:#1E293B;display:flex;align-items:center;justify-content:center;font-size:18px;color:#38BDF8;&quot;&gt;📊&lt;/div&gt;&lt;/td&gt;&lt;td style=&quot;padding-left:12px;vertical-align:middle;&quot;&gt;&lt;b style=&quot;font-size:14.5px;color:#FFFFFF;&quot;&gt;Looker Governed&lt;br&gt;Semantic Metric Layer&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10.5px;color:#94A3B8;&quot;&gt;Consistent business metrics&lt;/span&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#182234;strokeColor=#2E3D56;strokeWidth=1.5;align=left;verticalAlign=middle;padding=8;arcSize=10;" vertex="1" parent="1">
          <mxGeometry x="270" y="725" width="260" height="90" as="geometry"/>
        </mxCell>

        <!-- Card: Vertex AI In-Database ML -->
        <mxCell id="card_vertex" value="&lt;table cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; style=&quot;width:100%;height:100%;&quot;&gt;&lt;tr&gt;&lt;td style=&quot;width:40px;text-align:center;vertical-align:middle;&quot;&gt;&lt;div style=&quot;width:32px;height:32px;border-radius:50%;background:#1E293B;display:flex;align-items:center;justify-content:center;font-size:18px;color:#38BDF8;&quot;&gt;🤖&lt;/div&gt;&lt;/td&gt;&lt;td style=&quot;padding-left:12px;vertical-align:middle;&quot;&gt;&lt;b style=&quot;font-size:14.5px;color:#FFFFFF;&quot;&gt;Vertex AI&lt;br&gt;In-Database ML&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10.5px;color:#94A3B8;&quot;&gt;Advanced analytics integra&lt;br&gt;with data warehouse&lt;/span&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#182234;strokeColor=#2E3D56;strokeWidth=1.5;align=left;verticalAlign=middle;padding=8;arcSize=10;" vertex="1" parent="1">
          <mxGeometry x="570" y="725" width="240" height="90" as="geometry"/>
        </mxCell>

        <!-- Connector Looker -> Vertex -->
        <mxCell id="e_looker_vertex" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#52617A;strokeWidth=1.5;endArrow=classic;endFill=1;" edge="1" parent="1" source="card_looker" target="card_vertex">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <!-- Connector Spark -> Vertex labeled Step 5 -->
        <mxCell id="e_spark_vertex" value="&lt;span style=&quot;font-size:11px;color:#94A3B8;&quot;&gt;Step 5&lt;/span&gt;" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#52617A;strokeWidth=1.5;endArrow=classic;endFill=1;labelBackgroundColor=#0B111E;" edge="1" parent="1" source="card_spark" target="card_vertex">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="670" y="660"/>
              <mxPoint x="670" y="660"/>
            </Array>
          </mxGeometry>
        </mxCell>

        <!-- Card: Zero-Copy Secure Data Clean Rooms -->
        <mxCell id="card_cleanrooms" value="&lt;table cellpadding=&quot;0&quot; cellspacing=&quot;0&quot; style=&quot;width:100%;height:100%;&quot;&gt;&lt;tr&gt;&lt;td style=&quot;width:40px;text-align:center;vertical-align:middle;&quot;&gt;&lt;div style=&quot;width:32px;height:32px;border-radius:50%;background:#1E293B;display:flex;align-items:center;justify-content:center;font-size:18px;color:#38BDF8;&quot;&gt;🔄&lt;/div&gt;&lt;/td&gt;&lt;td style=&quot;padding-left:12px;vertical-align:middle;&quot;&gt;&lt;b style=&quot;font-size:14.5px;color:#FFFFFF;&quot;&gt;Zero-Copy Secure&lt;br&gt;Data Clean Rooms&lt;/b&gt;&lt;br&gt;&lt;span style=&quot;font-size:10.5px;color:#94A3B8;&quot;&gt;Governed data sharing&lt;br&gt;and collaboration&lt;/span&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#182234;strokeColor=#2E3D56;strokeWidth=1.5;align=left;verticalAlign=middle;padding=8;arcSize=10;" vertex="1" parent="1">
          <mxGeometry x="850" y="725" width="240" height="90" as="geometry"/>
        </mxCell>

        <!-- Connector Vertex -> Clean Rooms -->
        <mxCell id="e_vertex_clean" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#52617A;strokeWidth=1.5;endArrow=classic;endFill=1;" edge="1" parent="1" source="card_vertex" target="card_cleanrooms">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>

        <!-- Connector Clean Rooms -> BigQuery Omni labeled Step 6 -->
        <mxCell id="e_clean_omni" value="&lt;span style=&quot;font-size:11px;color:#94A3B8;&quot;&gt;Step 6&lt;/span&gt;" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor=#52617A;strokeWidth=1.5;endArrow=classic;endFill=1;labelBackgroundColor=#0B111E;" edge="1" parent="1" source="card_cleanrooms" target="card_omni">
          <mxGeometry relative="1" as="geometry">
            <Array as="points">
              <mxPoint x="930" y="660"/>
              <mxPoint x="930" y="660"/>
            </Array>
          </mxGeometry>
        </mxCell>

      </root>
    </mxGraphModel>
  </diagram>
</mxfile>"""
    return xml

if __name__ == '__main__':
    xml = generate_lakehouse_xml()
    with open('scratch/03_lakehouse_target_state_biglake_omni.drawio.xml', 'w') as f:
        f.write(xml)
    with open('client/public/blueprints/03_lakehouse_target_state_biglake_omni.drawio.xml', 'w') as f:
        f.write(xml)
    with open('client/build/blueprints/03_lakehouse_target_state_biglake_omni.drawio.xml', 'w') as f:
        f.write(xml)
    print("Updated 03_lakehouse_target_state_biglake_omni.drawio.xml to 100% exact replica!")
