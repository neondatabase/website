import ScalarMount from './ScalarMount';

const SPEC_URL = 'https://neon.com/api_spec/release/v2.json';

export default async function ApiReferencePage() {
  let spec: Record<string, unknown>;

  try {
    const res = await fetch(SPEC_URL, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Spec fetch failed: ${res.status}`);
    spec = await res.json();
  } catch {
    return <p className="p-8 text-gray-new-50">Failed to load API spec. Please try again later.</p>;
  }

  if (spec.info && typeof spec.info === 'object') {
    const info = spec.info as Record<string, unknown>;
    delete info.contact;
    if (typeof info.description === 'string') {
      info.description = info.description.replaceAll(
        'https://neon.tech/docs/',
        'https://neon.com/docs/'
      );
    }
  }

  return <ScalarMount spec={JSON.stringify(spec)} />;
}
