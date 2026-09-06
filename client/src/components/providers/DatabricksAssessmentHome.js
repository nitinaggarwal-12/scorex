import React from 'react';
import ProviderHomeShell, {
  PROVIDER_ACCENT,
  Section, SectionTitle, Card, CardTitle, CardBody, GapNotice
} from './ProviderHomeShell';

/**
 * Databricks assessment home.
 *
 * A standalone offering, separate from the Google Cloud assessment. It reaches the
 * legacy Databricks engine only through the provider registry, so no Databricks
 * capability content can appear in a Google Cloud report and vice versa.
 */
export default function DatabricksAssessmentHome() {
  return (
    <ProviderHomeShell
      providerId="databricks"
      eyebrow="Databricks"
      accent={PROVIDER_ACCENT}
      title="Databricks Assessment"
      lede={
        'Assess data and AI maturity and map the results to Databricks capabilities. '
        + 'This is a separate offering from the Google Cloud assessment: the two share '
        + 'the pillar framework and scoring model, and nothing else.'
      }
    >
      <Section>
        <SectionTitle>How this assessment reports</SectionTitle>
        <Card>
          <CardTitle>Legacy capability mappings</CardTitle>
          <CardBody>
            The Databricks mappings predate the catalog provenance rules and are not
            individually sourced or dated, unlike the Google Cloud catalog. They are
            usable, but treat specific product claims as needing a check against current
            Databricks documentation before a customer session.
          </CardBody>
        </Card>
        <Card>
          <CardTitle>No peer percentiles or ROI multiples</CardTitle>
          <CardBody>
            As with the Google Cloud assessment, narrative output passes through the
            provenance policy. Unsourced industry statistics and ROI claims are removed
            rather than shown as fact.
          </CardBody>
        </Card>
        <GapNotice>
          Assessments are pinned to a provider at creation and cannot be switched
          afterwards. To assess the same customer on Google Cloud, start a new assessment
          from the Google Cloud page.
        </GapNotice>
      </Section>
    </ProviderHomeShell>
  );
}
