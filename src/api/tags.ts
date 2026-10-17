import type { HubTag, Paginated } from "@/types/dockerhub";
import type { Page, RepositoryTag } from "@/types/repository";
import { ApiError, getJson } from "./client";
import { repositoryTagApiPath, repositoryTagsApiPath } from "./paths";

const MAX_TAG_OFFSET = 1000;

export function isTagPageReachable(page: number, pageSize: number): boolean {
  return (page - 1) * pageSize < MAX_TAG_OFFSET;
}

export async function listRepositoryTags(
  namespace: string,
  name: string,
  { page, pageSize }: { page: number; pageSize: number },
  signal?: AbortSignal,
): Promise<Page<RepositoryTag>> {
  const data = await getJson<Paginated<HubTag>>(
    repositoryTagsApiPath(namespace, name),
    { page, page_size: pageSize },
    signal,
  );
  return { total: data.count, items: data.results.map(toRepositoryTag) };
}

export async function getRepositoryTag(
  namespace: string,
  name: string,
  tag: string,
  signal?: AbortSignal,
): Promise<RepositoryTag | null> {
  try {
    const data = await getJson<HubTag>(
      repositoryTagApiPath(namespace, name, tag),
      {},
      signal,
    );
    return toRepositoryTag(data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

function toRepositoryTag(tag: HubTag): RepositoryTag {
  return {
    name: tag.name,
    updatedAt: tag.last_updated,
    size: tag.full_size,
    platforms: tag.images
      .filter((image) => image.architecture !== "unknown")
      .map((image) => ({
        label: [image.os, image.architecture, image.variant]
          .filter(Boolean)
          .join("/"),
        size: image.size,
      })),
  };
}
