import { getResources, getResourceTags } from './utils/resource-utils';
import ClientPage from './client-page';

export default async function Page() {
  const [data, tags] = await Promise.all([
    getResources(),
    getResourceTags()
  ]);
  
  return <ClientPage initialResources={data.resources} initialTags={tags} />;
}
