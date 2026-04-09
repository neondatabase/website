import fs from 'fs';
import path from 'path';

import { NextResponse } from 'next/server';
import yaml from 'js-yaml';

export const revalidate = false;

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'content/config/topbar.yaml');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const topbarData = yaml.load(fileContent) || { text: '', link: null };
    return NextResponse.json(topbarData, { status: 200 });
  } catch (error) {
    console.error('Failed to read topbar config', error);
    return NextResponse.json({ error: 'Failed to read topbar config' }, { status: 500 });
  }
}
