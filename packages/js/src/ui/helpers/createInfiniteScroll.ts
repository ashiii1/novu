import { Accessor, batch, createComputed, createResource, createSignal, onCleanup } from 'solid-js';
import { isServer } from 'solid-js/web';

export function createInfiniteScroll<T>(fetcher: (page: number) => Promise<{ data: T[]; hasMore: boolean }>): [
  data: Accessor<T[]>,
  options: {
    initialLoading: Accessor<boolean>;
    setEl: (el: Element) => void;
    offset: Accessor<number>;
    end: Accessor<boolean>;
  }
] {
  const [data, setData] = createSignal<T[]>([]);
  const [initialLoading, setInitialLoading] = createSignal(true);
  const [offset, setOffset] = createSignal(0);
  const [end, setEnd] = createSignal(false);
  const [contents] = createResource(offset, fetcher);

  let setEl: (el: Element) => void = () => {};
  if (!isServer) {
    const io = new IntersectionObserver((e) => {
      if (e.length > 0 && e[0]!.isIntersecting && !end() && !contents.loading) {
        setOffset(setOffset(data().length));
      }
    });
    onCleanup(() => io.disconnect());
    setEl = (el: Element) => {
      io.observe(el);
      onCleanup(() => io.unobserve(el));
    };
  }

  createComputed(() => {
    const content = contents.latest;
    if (!content) return;
    setInitialLoading(false);
    batch(() => {
      if (!content.hasMore) setEnd(true);
      setData((p) => [...p, ...content.data]);
    });
  });

  return [
    data,
    {
      initialLoading,
      setEl,
      offset: offset,
      end: end,
    },
  ];
}
