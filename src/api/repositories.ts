import type {
  HubRepository,
  HubRepositoryDetails,
  HubSearchResponse,
  HubSearchResult,
  SearchOrdering,
} from "@/types/dockerhub";
import type {
  RepositoryDetails,
  RepositorySummary,
  SearchParams,
  SearchResult,
  SearchSort,
} from "@/types/repository";
import { getJson } from "./client";
import { repositoryApiPath, SEARCH_API_PATH } from "./paths";

const OFFICIAL_NAMESPACE = "library";
// Anonymous search requests are refused (403) once `from + size` exceeds this.
const MAX_ANONYMOUS_RESULTS = 1000;

export function isPageReachable(page: number, pageSize: number): boolean {
  return page * pageSize <= MAX_ANONYMOUS_RESULTS;
}

// Best match is the API's default, used when no sort is sent.
const ORDERING: Record<SearchSort, SearchOrdering | undefined> = {
  bestMatch: undefined,
  pullCount: "pull_count",
  lastUpdated: "updated_at",
};

type SearchHubParams = {
  query: string;
  from?: number;
  size: number;
  sort?: SearchOrdering;
  order?: "desc";
};

// The v2 API can't search across namespaces or return logos, so search uses v4.
function searchHub(params: SearchHubParams, signal?: AbortSignal) {
  return getJson<HubSearchResponse>(
    SEARCH_API_PATH,
    { ...params, type: "image" },
    signal,
  );
}

export async function searchRepositories(
  { query, page, pageSize, sort }: SearchParams,
  signal?: AbortSignal,
): Promise<SearchResult> {
  const ordering = ORDERING[sort];
  const data = await searchHub(
    {
      query,
      from: (page - 1) * pageSize,
      size: pageSize,
      ...(ordering && { sort: ordering, order: "desc" }),
    },
    signal,
  );
  return { total: data.total, items: toSummaries(data.results) };
}

export async function getPopularRepositories(
  limit: number,
  signal?: AbortSignal,
): Promise<RepositorySummary[]> {
  const data = await searchHub(
    { query: "", size: limit, sort: "pull_count", order: "desc" },
    signal,
  );
  return toSummaries(data.results);
}

export async function getRepository(
  namespace: string,
  name: string,
  signal?: AbortSignal,
): Promise<RepositoryDetails> {
  const data = await getJson<HubRepositoryDetails>(
    repositoryApiPath(namespace, name),
    {},
    signal,
  );
  return { ...toRepositorySummary(data), readme: data.full_description ?? "" };
}

// `type=image` still lets promoted results (Hardened Images, MCP servers).
function toSummaries(results: HubSearchResult[]): RepositorySummary[] {
  return results
    .filter((result) => result.type === "image")
    .map(fromSearchResult);
}

function fromSearchResult(result: HubSearchResult): RepositorySummary {
  const [namespace, name] = result.id.split("/");
  return {
    ...identityFields(namespace, name, result.short_description ?? ""),
    pullCount: result.raw_pull_count,
    starCount: result.star_count,
    updatedAt: result.updated_at,
    categories: (result.categories ?? []).map((category) => category.name),
    logoUrl: logoUrlOf(result),
  };
}

function toRepositorySummary(repository: HubRepository): RepositorySummary {
  const { namespace, name, description } = repository;
  return {
    ...identityFields(namespace, name, description),
    pullCount: repository.pull_count,
    starCount: repository.star_count,
    updatedAt: repository.last_updated,
    categories: repository.categories.map((category) => category.name),
  };
}

function identityFields(namespace: string, name: string, description: string) {
  const isOfficial = namespace === OFFICIAL_NAMESPACE;
  return {
    namespace,
    name,
    displayName: isOfficial ? name : `${namespace}/${name}`,
    owner: isOfficial ? "Docker" : namespace,
    description,
    isOfficial,
    isDeprecated: /^deprecated\b/i.test(description),
  };
}

function logoUrlOf(result: HubSearchResult): string | undefined {
  return result.logo_url?.small ?? result.logo_url?.large ?? undefined;
}
