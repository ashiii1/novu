/* eslint-disable local-rules/no-class-without-style */
import { cn, useStyle } from '../../helpers';
import { Tabs } from '../primitives';
import { tabsTriggerVariants } from '../primitives/Tabs/TabsTrigger';

export const InboxTab = (props: { label: string; class?: string }) => {
  const style = useStyle();

  // TODO: Replace with actual count from API
  const count = Math.floor(Math.random() * 120 + 1);

  return (
    <Tabs.Trigger
      value={props.label}
      class={style(
        'notificationsTabs__tabsTrigger',
        cn(tabsTriggerVariants(), `nt-flex nt-gap-2 ${props.class ?? ''}`)
      )}
    >
      <span class={style('notificationsTabsTriggerLabel', 'nt-text-sm nt-font-medium')}>{props.label}</span>
      <span
        class={style(
          'notificationsTabsTriggerCount',
          'nt-rounded-full nt-bg-primary nt-px-[6px] nt-text-primary-foreground nt-text-sm'
        )}
      >
        {count >= 100 ? '99+' : count}
      </span>
    </Tabs.Trigger>
  );
};
