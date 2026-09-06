import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

/**
 * Presentational shell shared by the two provider landing pages.
 *
 * Layout, spacing and loading behaviour are shared deliberately — duplicating them
 * is how the two pages drift apart over time. Everything vendor-specific (copy,
 * accent colour, capability content) is passed in by the page, and no vendor
 * content lives in this file.
 */

/**
 * One accent for every vendor. The questionnaire and report are a single shared
 * design; per-vendor colours would make two products out of one and would leak
 * vendor identity into a layout that is meant to be identical everywhere.
 */
export const PROVIDER_ACCENT = '#334155';

const Page = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 40px 24px 72px;

  @media (max-width: 768px) {
    padding: 24px 16px 48px;
  }
`;

const Hero = styled.header`
  border-left: 4px solid ${(props) => props.$accent};
  padding-left: 20px;
  margin-bottom: 36px;
`;

const Eyebrow = styled.div`
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${(props) => props.$accent};
  font-weight: 700;
  margin-bottom: 8px;
`;

const Title = styled.h1`
  font-size: 34px;
  line-height: 1.15;
  margin: 0 0 12px;
  color: #0f172a;

  @media (max-width: 768px) {
    font-size: 26px;
  }
`;

const Lede = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #475569;
  margin: 0;
  max-width: 68ch;
`;

const Section = styled.section`
  margin-top: 36px;
`;

const SectionTitle = styled.h2`
  font-size: 15px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #64748b;
  margin: 0 0 16px;
`;

const Card = styled.article`
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 12px;
  background: #ffffff;
`;

const CardTitle = styled.h3`
  font-size: 17px;
  margin: 0 0 6px;
  color: #0f172a;
`;

const FormerName = styled.div`
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
  font-style: italic;
`;

const CardBody = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #334155;
  margin: 0 0 12px;
`;

const SourceLine = styled.div`
  font-size: 12px;
  color: #64748b;

  a {
    color: #1d4ed8;
  }
`;

const GapNotice = styled.div`
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  padding: 18px 20px;
  background: #f8fafc;
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
`;

const Status = styled.div`
  font-size: 14px;
  color: #64748b;
  padding: 24px 0;
`;

export default function ProviderHomeShell({
  providerId,
  eyebrow,
  accent,
  title,
  lede,
  children
}) {
  const [coverage, setCoverage] = useState(null);
  const [state, setState] = useState('loading');

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/providers/${providerId}/coverage`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setCoverage(data);
        setState('ready');
      })
      .catch(() => {
        if (!cancelled) setState('error');
      });

    return () => { cancelled = true; };
  }, [providerId]);

  return (
    <Page>
      <Hero $accent={accent}>
        <Eyebrow $accent={accent}>{eyebrow}</Eyebrow>
        <Title>{title}</Title>
        <Lede>{lede}</Lede>
      </Hero>

      {children}

      <Section>
        <SectionTitle>Capability coverage</SectionTitle>

        {state === 'loading' && <Status>Loading coverage…</Status>}

        {state === 'error' && (
          <GapNotice>
            Coverage information could not be loaded. Rather than showing a coverage
            figure that may be wrong, nothing is shown. Retry, or check the provider
            API before running a customer session.
          </GapNotice>
        )}

        {state === 'ready' && coverage && (
          <>
            {coverage.note && <GapNotice>{coverage.note}</GapNotice>}

            {Array.isArray(coverage.gaps) && coverage.gaps.length > 0 && (
              <GapNotice>
                <strong>Not yet covered:</strong>{' '}
                {coverage.gaps.map((gap) => gap.pillar.replace(/_/g, ' ')).join(', ')}.
                {' '}These pillars have no verified capability mappings, so assessments
                will report them as uncovered rather than generating recommendations.
              </GapNotice>
            )}
          </>
        )}
      </Section>
    </Page>
  );
}

export { Section, SectionTitle, Card, CardTitle, CardBody, FormerName, SourceLine, GapNotice };
