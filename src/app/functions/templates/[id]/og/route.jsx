import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import {
  getFunctionRegistryCatalog,
  isNeonRegistryTemplate,
  isRegistryLogoUrl,
  registryCategoryLabel,
  registryProviderLabel,
  registryTemplateSource,
  REGISTRY_COMMUNITY_CATEGORY,
  REGISTRY_FIRST_PARTY_CATEGORY,
  REGISTRY_PARTNER_CATEGORY,
} from 'utils/function-registry';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const templates = await getFunctionRegistryCatalog();
  return templates.map((template) => ({ id: template.id }));
}

const assets = Promise.all([
  readFile(join(process.cwd(), 'src', 'fonts', 'geist-mono', 'GeistMono-Regular.ttf')),
  readFile(join(process.cwd(), 'src', 'fonts', 'inter', 'Inter-Regular.ttf')),
  readFile(join(process.cwd(), 'public', 'images', 'og-image', 'logo.png')),
  readFile(join(process.cwd(), 'public', 'images', 'og-image', 'docs-background.jpg')),
  readFile(join(process.cwd(), 'public', 'images', 'technology-logos', 'neon-dark.svg')),
]);

const SOURCE_COLORS = {
  [REGISTRY_FIRST_PARTY_CATEGORY]: '#00E599',
  [REGISTRY_PARTNER_CATEGORY]: '#648DFF',
  [REGISTRY_COMMUNITY_CATEGORY]: '#C9CBCF',
};

const LOGO_CONTENT_TYPES = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/gif'];
const LOGO_MAX_BYTES = 512 * 1024;
const LOGO_TIMEOUT_MS = 5000;

const LONG_TITLE_LENGTH = 40;

const toDataUri = (buffer, contentType) =>
  `data:${contentType};base64,${Buffer.from(buffer).toString('base64')}`;

const fetchLogoDataUri = async (url) => {
  try {
    const response = await fetch(url.trim(), {
      signal: AbortSignal.timeout(LOGO_TIMEOUT_MS),
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    const contentType = response.headers.get('content-type')?.split(';')[0].trim();
    if (!LOGO_CONTENT_TYPES.includes(contentType)) return null;
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength > LOGO_MAX_BYTES) return null;
    return toDataUri(buffer, contentType);
  } catch {
    return null;
  }
};

const templateLogoDataUri = async (template, neonLogo) => {
  const url = [template.logoDark, template.logo].find(isRegistryLogoUrl);
  if (url) {
    const logo = await fetchLogoDataUri(url);
    if (logo) return logo;
  }
  return isNeonRegistryTemplate(template) ? neonLogo : null;
};

export async function GET(request, { params }) {
  const { id } = await params;
  const templates = await getFunctionRegistryCatalog();
  const template = templates.find((item) => item.id === id);
  if (!template) return new Response('Not found', { status: 404 });

  try {
    const [fontDataMono, fontDataInter, logoBuffer, backgroundBuffer, neonIconBuffer] =
      await assets;

    const neonLogo = toDataUri(neonIconBuffer, 'image/svg+xml');
    const templateLogo = await templateLogoDataUri(template, neonLogo);
    const provider = registryProviderLabel(template) || 'Neon';
    const source = registryTemplateSource(template);

    return new ImageResponse(
      <div
        style={{
          position: 'relative',
          backgroundColor: '#0A0B0D',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 64px 64px',
        }}
      >
        <img
          width={1200}
          height={630}
          src={toDataUri(backgroundBuffer, 'image/jpeg')}
          style={{ position: 'absolute', top: 0, left: 0 }}
          alt=""
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <img width={171} height={48} src={toDataUri(logoBuffer, 'image/png')} alt="" />
          <div
            style={{
              fontFamily: 'Geist Mono',
              fontSize: 22,
              letterSpacing: '0.02em',
              color: '#797D86',
              marginTop: 4,
            }}
          >
            / Function Templates
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 'auto',
            maxWidth: 820,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 96,
                height: 96,
                border: '1px solid #303236',
                backgroundColor: '#131415',
              }}
            >
              {templateLogo ? (
                <img
                  width={60}
                  height={60}
                  src={templateLogo}
                  style={{ objectFit: 'contain' }}
                  alt=""
                />
              ) : (
                <div style={{ fontFamily: 'Inter', fontSize: 48, color: 'white' }}>
                  {provider.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {source && (
                <div
                  style={{
                    fontFamily: 'Geist Mono',
                    fontSize: 20,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: SOURCE_COLORS[source],
                  }}
                >
                  {registryCategoryLabel(source)}
                </div>
              )}
              <div style={{ fontFamily: 'Inter', fontSize: 28, color: '#C9CBCF' }}>
                {`Built by ${provider}`}
              </div>
            </div>
          </div>
          <div
            style={{
              display: '-webkit-box',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              fontFamily: 'Inter',
              fontSize: template.title.length > LONG_TITLE_LENGTH ? 56 : 68,
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              color: 'white',
              textWrap: 'pretty',
            }}
          >
            {template.title}
          </div>
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              marginTop: 36,
              padding: '14px 20px',
              border: '1px solid #303236',
              backgroundColor: '#0A0B0D',
              fontFamily: 'Geist Mono',
              fontSize: 24,
              color: '#C9CBCF',
            }}
          >
            <span style={{ color: '#797D86', marginRight: 14 }}>$</span>
            {`neon functions new ${template.id}`}
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: 'Geist Mono', data: fontDataMono, style: 'normal', weight: 400 },
          { name: 'Inter', data: fontDataInter, style: 'normal', weight: 400 },
        ],
      }
    );
  } catch (e) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, { status: 500 });
  }
}
