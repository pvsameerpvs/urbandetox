import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { DOCUMENT_TYPE } from '../constants';
import { getUploadsRoot } from '../db/client';
import { createId, sanitizeFilename } from '../utils';

const FOLDER_BY_TYPE: Record<string, string> = {
  [DOCUMENT_TYPE.GOVERNMENT_ID]: 'participant-ids',
  [DOCUMENT_TYPE.RECENT_PHOTO]: 'participant-photos',
  [DOCUMENT_TYPE.MEDICAL_NOTE]: 'participant-medical-docs',
  [DOCUMENT_TYPE.OTHER]: 'participant-other-docs',
};

export async function saveParticipantDocument(
  participantId: string,
  documentType: string,
  file: File
): Promise<{ storagePath: string; mimeType: string }> {
  const folder = FOLDER_BY_TYPE[documentType] ?? FOLDER_BY_TYPE[DOCUMENT_TYPE.OTHER];
  const safeName = `${createId('doc')}-${sanitizeFilename(file.name)}`;
  const relativePath = `${folder}/${participantId}/${safeName}`;
  const absolutePath = resolve(getUploadsRoot(), relativePath);
  const bytes = Buffer.from(await file.arrayBuffer());

  await mkdir(resolve(getUploadsRoot(), folder, participantId), { recursive: true });
  await writeFile(absolutePath, bytes);

  return {
    storagePath: relativePath,
    mimeType: file.type || 'application/octet-stream',
  };
}
