import { useState } from 'react';
import { AlertTriangle, Code2, ShieldOff, ScrollText, X } from 'lucide-react';

export const DISCLAIMER_VERSION = 'v1';
export const DISCLAIMER_STORAGE_KEY = `gemini_disclaimer_accepted_${DISCLAIMER_VERSION}`;

/**
 * Blocking-on-first-run disclaimer covering three things:
 *  1. This repo is public / open source -- don't put confidential data in it.
 *  2. Standard "AS IS" / no-warranty language.
 *  3. Standard limitation-of-liability language.
 *
 * `forceAccept` (used on first run) hides the dismiss-without-accepting
 * paths (backdrop click, X button) so the warning can't be skipped
 * accidentally. When reopened later via the sidebar link, forceAccept is
 * false and it behaves like a normal, closable modal.
 *
 * NOTE: this is standard boilerplate language, not a substitute for an
 * actual legal review. See src/components/ui/README.md.
 */
export default function DisclaimerModal({ isOpen, onAccept, onClose, forceAccept = false }) {
  const [checked, setChecked] = useState(false);

  if (!isOpen) return null;

  const canClose = !forceAccept;

  return (
    <div
      className="modal-backdrop"
      onClick={canClose ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
    >
      <div className="modal-box disclaimer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="disclaimer-modal__header">
          <div className="disclaimer-modal__header-icon">
            <AlertTriangle size={20} aria-hidden="true" />
          </div>
          <h2 id="disclaimer-title">Before you use this tool</h2>
          {canClose && (
            <button type="button" onClick={onClose} aria-label="Close disclaimer" className="disclaimer-modal__close">
              <X size={18} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="disclaimer-modal__body">
          <section>
            <h3><Code2 size={15} aria-hidden="true" /> Open source &mdash; do not enter confidential data</h3>
            <p>
              This application's source code is publicly hosted on GitHub. It is not a secured
              enterprise system. <strong>Do not enter, upload, paste, or otherwise submit any
              confidential, proprietary, customer, patient, or personally identifiable information</strong>{' '}
              into any field in this tool. Treat everything you type here as if it could become
              publicly visible, because the underlying code that stores and processes it is.
            </p>
          </section>

          <section>
            <h3><ScrollText size={15} aria-hidden="true" /> Independent tool, not an official product</h3>
            <p>
              This is an independent, internally-built tool and is not an official Google product,
              is not endorsed or supported by Google, and carries no Google support commitment or
              SLA. References to "Gemini," "Google Cloud," or other marks are for descriptive
              purposes only and do not imply endorsement.
            </p>
          </section>

          <section>
            <h3><ShieldOff size={15} aria-hidden="true" /> No warranty</h3>
            <p>
              This software is provided <strong>"AS IS"</strong>, without warranty of any kind,
              express or implied, including without limitation the warranties of merchantability,
              fitness for a particular purpose, accuracy, and non-infringement. Scores,
              recommendations, and any AI-generated content are assistive outputs only &mdash; they
              may be inaccurate or incomplete, and do not constitute professional, legal,
              financial, medical, or regulatory advice.
            </p>
          </section>

          <section>
            <h3>Limitation of liability</h3>
            <p>
              To the maximum extent permitted by applicable law, the author(s) and contributor(s)
              of this software shall not be liable for any claim, damages, or other liability,
              whether in an action of contract, tort, or otherwise, arising from, out of, or in
              connection with this software or its use, including without limitation any direct,
              indirect, incidental, special, exemplary, or consequential damages (including loss of
              data, revenue, or business opportunity), even if advised of the possibility of such
              damages.
            </p>
          </section>

          <section>
            <h3>Your responsibility</h3>
            <p>
              By continuing, you confirm that you are solely responsible for the data you enter and
              any decisions made based on this tool's output, and that you will not submit any
              information you are not authorized to disclose.
            </p>
          </section>
        </div>

        <div className="disclaimer-modal__footer">
          <label className="disclaimer-modal__checkbox">
            <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
            <span>I have read this and will not enter confidential or sensitive data into this tool.</span>
          </label>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!checked}
            onClick={onAccept}
            style={{ opacity: checked ? 1 : 0.5, cursor: checked ? 'pointer' : 'not-allowed' }}
          >
            Acknowledge &amp; continue
          </button>
        </div>
      </div>
    </div>
  );
}
