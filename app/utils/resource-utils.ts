export async function getResources() {
  const resources = await import('@/data/resources.json');
  return resources.default || resources;
}

export async function getResourceSchema() {
  const schema = await import('@/data/resources-schema.json');
  return schema.default || schema;
}

export async function getResourceTags() {
  const schema = await import('@/data/resources-schema.json');
  return schema.properties?.resources?.items?.properties?.tags?.items?.enum || [];
}