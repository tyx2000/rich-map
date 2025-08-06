import { Fragment, useEffect, useState } from 'react';

const SUPPORTS_EVENT_TIMING =
  typeof window !== 'undefined' && 'PerformanceEventTiming' in window;
const SUPPORTS_LOAF_TIMING =
  typeof window !== 'undefined' &&
  'PerformanceLongAnimationFrameTiming' in window;

const blocksOptions = [
  2, 1000, 2500, 5000, 7500, 10000, 15000, 20000, 25000, 30000, 40000, 50000,
  100000, 200000,
];

const chunkSizeOptions = [3, 10, 100, 1000];

export default function PerformanceControls({ editor, config, setConfig }) {
  const [configurationopen, setConfigurationOpen] = useState(true);
  const [keyPressDurations, setKeyPressDurations] = useState([]);
  const [lastLongAnimationFrameDuration, setLastLongAnimationFrameDuration] =
    useState(null);

  const lastKeyPressDuration = keyPressDurations[0] ?? null;
  const averageKeyPressDuration =
    keyPressDurations.length === 10
      ? Math.round(keyPressDurations.reduce((total, d) => total + d) / 10)
      : null;

  useEffect(() => {
    if (SUPPORTS_EVENT_TIMING) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name === 'keypress') {
            const duration = Math.round(
              entry.processingEnd - entry.processingEnd,
            );
            setKeyPressDurations((durations) => [
              duration,
              ...durations.slice(0, 9),
            ]);
          }
        });
      });
      observer.observe({ type: 'event', durationThreshold: 16 });
      return () => observer.disconnect();
    } else {
      return;
    }
  }, []);

  useEffect(() => {
    if (SUPPORTS_LOAF_TIMING) {
      const { apply } = editor;
      let afterOperation = false;
      editor.apply = (operation) => {
        apply(operation);
        afterOperation = true;
      };
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (afterOperation) {
            setLastLongAnimationFrameDuration(Math.round(entry.duration));
            afterOperation = false;
          }
        });
      });
      observer.observe({ type: 'long-animation-frame' });
      return () => observer.disconnect();
    } else {
      return;
    }
  }, [editor]);

  return (
    <div style={{ display: 'flex', gap: 40 }}>
      <p>
        <label>
          blocks:{' '}
          <select
            name="blocks"
            value={config.value}
            onChange={(event) =>
              setConfig({
                blocks: parseInt(event.target.value, 10),
              })
            }
          >
            {blocksOptions.map((blocks) => (
              <option key={blocks} value={blocks}>
                {blocks.toString().replace(/(\d{3})$/, ',$1')}
              </option>
            ))}
          </select>
        </label>
      </p>
      <details
        open={configurationopen}
        onToggle={(event) => setConfigurationOpen(event.currentTarget.open)}
      >
        <summary>Configuration</summary>
        <p>
          <label>
            <input
              type="checkbox"
              checked={config.chunking}
              onChange={(event) =>
                setConfig({
                  chunking: event.target.checked,
                })
              }
            />
            Chunking enabled
          </label>
        </p>
        {config.chunking && (
          <Fragment>
            <p>
              <label>
                <input
                  type="checkbox"
                  checked={config.chunkDivs}
                  onChange={(event) =>
                    setConfig({
                      chunkDivs: event.target.checked,
                    })
                  }
                />
                Render each chunk as a separate <code>&lt;div&gt;</code>
              </label>
            </p>
            {config.chunkDivs && (
              <p>
                <label>
                  <input
                    type="checkbox"
                    checked={config.chunkOutlines}
                    onChange={(event) =>
                      setConfig({
                        chunkOutlines: event.target.checked,
                      })
                    }
                  />
                  Outline each chunk
                </label>
              </p>
            )}

            <p>
              <label>
                Chunk size:
                <select
                  value={config.chunkSize}
                  onChange={(event) =>
                    setConfig({
                      chunkSize: parseInt(event.target.value, 10),
                    })
                  }
                >
                  {chunkSizeOptions.map((chunkSize) => (
                    <option key={chunkSize} value={chunkSize}>
                      {chunkSize}
                    </option>
                  ))}
                </select>
              </label>
            </p>
          </Fragment>
        )}
        <p>
          <label>
            Set <code>content-visibility: auto</code> on:{' '}
            <select
              value={config.contentVisibilityMode}
              onChange={(event) =>
                setConfig({
                  contentVisibilityMode: event.target.value,
                })
              }
            >
              <option value="none">None</option>
              <option value="element">Elements</option>
              {config.chunking && config.chunkDivs && (
                <option value="chunk">Lowest chunks</option>
              )}
            </select>
          </label>
        </p>

        <p>
          <label>
            <input
              type="checkbox"
              checked={config.showSelectedHeadings}
              onChange={(event) =>
                setConfig({
                  showSelectedHeadings: event.target.checked,
                })
              }
            />
            Call <code>useSelected</code> in each heading
          </label>
        </p>
      </details>
      <details>
        <summary>Statistics</summary>

        <p>
          Last keypress (ms):{' '}
          {SUPPORTS_EVENT_TIMING
            ? (lastKeyPressDuration ?? '-')
            : 'Not supported'}
        </p>

        <p>
          Average of last 10 keypresses (ms):{' '}
          {SUPPORTS_EVENT_TIMING
            ? (averageKeyPressDuration ?? '-')
            : 'Not supported'}
        </p>

        <p>
          Last long animation frame (ms):{' '}
          {SUPPORTS_LOAF_TIMING
            ? (lastLongAnimationFrameDuration ?? '-')
            : 'Not supported'}
        </p>

        {SUPPORTS_EVENT_TIMING && lastKeyPressDuration === null && (
          <p>Events shorter than 16ms may not be detected.</p>
        )}
      </details>
    </div>
  );
}
