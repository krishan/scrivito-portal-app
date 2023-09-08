import * as Scrivito from "scrivito";

export function provideStorageDataClass(className: string) {
  return Scrivito.provideDataClass(className, {
    connection: {
      create: (data) => callDataService(className, { method: "post", data }),

      delete: (id: string): Promise<void> =>
        callDataService(`${className}/${id}`, { method: "delete" }),

      get: (id: string) => callDataService(`${className}/${id}`),

      index: (params: any) =>
        callDataService(className, {
          params: {
            // TODO use operator prefix like eq.<value>
            ...params.filters(),
            _continuation: params.continuation(),
            // TODO format: age.desc,height.asc
            // _order: params.order(),
            _search: params.search(),
          },
        }),

      update: (id, data) =>
        callDataService(`${className}/${id}`, { method: "put", data }),
    },
  });
}

type Params = Record<string, string | undefined>;

interface Options {
  method?: string;
  data?: unknown;
  params?: Params;
}

async function callDataService(path: string, options: Options = {}) {
  return (
    await fetch(calculateRequestUrl(path, options.params), {
      headers: { "Content-Type": "application/json; charset=utf-8" },
      method: options.method,
      body:
        options.data === undefined ? undefined : JSON.stringify(options.data),
    })
  ).json();
}

// use configured instance (somehow)
const instanceId = "d414c5d2fc7a4edf34ae04d1315b8e77";

function calculateRequestUrl(path: string, params?: Params) {
  const apiUrl = new URL(
    `${document.location.origin}/xds/${instanceId}/data/${path}`
  );

  if (params) {
    for (const [name, value] of Object.entries(params)) {
      if (value) apiUrl.searchParams.append(name, value);
    }
  }

  return apiUrl.toString();
}
