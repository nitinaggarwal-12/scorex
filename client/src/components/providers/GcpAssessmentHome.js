import React, { useEffect, useState } from 'react';
import ProviderHomeShell, {
  Section, SectionTitle, Card, CardTitle, CardBody, FormerName, SourceLine, GapNotice
} from './ProviderHomeShell';

/**
 * Google Cloud assessment home.
 *
 * Renders only capabilities returned by the GCP provider. Every capability shows
 * its Google documentation source and the date it was last verified, because
 * Google renames these products frequently and a stale name in front of a
 * customer costs credibility.
 */
export default function GcpAssessmentHome() {
  const [pillars, setPillars] = useState([]);
  const [state, setState] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/providers/gcp/coverage')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setPillars(data.coveredPillars || []);
        setState('ready');
      })
      .catch(() => !cancelled && setState('error'));
    return () => { cancelled = true; };
  }, []);

  return (
    <ProviderHomeShell
      providerId="gcp"
      eyebrow="Google Cloud"
      accent="#1a73e8"
      title="Google Cloud Assessment"
      lede={
        'Assess data and AI maturity and map the results to Google Cloud capabilities. '
        + 'Every recommendation cites the Google documentation it came from and the date it '
        + 'was last verified. Pillars without a verified mapping are reported as uncovered '
        + 'rather than filled with generic advice.'
      }
    >
      <Section>
        <SectionTitle>How this assessment reports</SectionTitle>
        <Card>
          <CardTitle>Sourced recommendations only</CardTitle>
          <CardBody>
            A capability cannot enter the Google Cloud catalog without a link to Google's own
            product documentation and a verification date. Coverage is currently partial and
            shown honestly on this page.
          </CardBody>
        </Card>
        <Card>
          <CardTitle>No peer percentiles or ROI multiples</CardTitle>
          <CardBody>
            This assessment scores the customer against their own stated target state. It does
            not report industry percentiles, market-distribution statistics or ROI figures,
            because no verified peer dataset backs them. Financial modelling is available
            separately as an explicit scenario built from customer-supplied baselines.
          </CardBody>
        </Card>
      </Section>

      {state === 'ready' && pillars.length === 0 && (
        <Section>
          <GapNotice>
            No pillars have verified Google Cloud mappings yet. Add entries to
            server/providers/gcp/capabilityCatalog.js before running this with a customer.
          </GapNotice>
        </Section>
      )}
    </ProviderHomeShell>
  );
}
