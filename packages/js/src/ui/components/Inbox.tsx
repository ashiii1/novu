import { Accessor, createSignal, JSX, Match, Show, Switch } from 'solid-js';
import { useStyle } from '../helpers';
import { NotificationMounter } from '../types';
import { Bell, Footer, Header, Preferences, PreferencesHeader } from './elements';
import { InboxTabs } from './InboxTabs';
import { NotificationList } from './Notification';
import { Button, Popover } from './primitives';

export type InboxProps = {
  open?: boolean;
  tabs?: Array<{ label: string; value: Array<string> }>;
  mountNotification?: NotificationMounter;
  renderBell?: ({ unreadCount }: { unreadCount: Accessor<number> }) => JSX.Element;
};

enum Screen {
  Inbox = 'inbox',
  Preferences = 'preferences',
}

type InboxContentProps = {
  tabs?: InboxProps['tabs'];
  mountNotification?: NotificationMounter;
};

const InboxContent = (props: InboxContentProps) => {
  const [currentScreen, setCurrentScreen] = createSignal<Screen>(Screen.Inbox);

  return (
    <>
      <Switch>
        <Match when={currentScreen() === Screen.Inbox}>
          <Header updateScreen={setCurrentScreen} />
          <Show
            when={props.tabs && props.tabs.length > 0}
            fallback={<NotificationList mountNotification={props.mountNotification} />}
          >
            <InboxTabs tabs={props.tabs ?? []} />
          </Show>
        </Match>
        <Match when={currentScreen() === Screen.Preferences}>
          <PreferencesHeader backAction={() => setCurrentScreen(Screen.Inbox)} />
          <Preferences />
        </Match>
      </Switch>
      <Footer />
    </>
  );
};

export const Inbox = (props: InboxProps) => {
  const style = useStyle();

  return (
    <Popover.Root open={props?.open}>
      <Popover.Trigger
        asChild={(triggerProps) => (
          <Button class={style('inbox__popoverTrigger')} variant="ghost" size="icon" {...triggerProps}>
            <Bell>{props.renderBell}</Bell>
          </Button>
        )}
      />
      <Popover.Content appearanceKey="inbox__popoverContent">
        <InboxContent tabs={props.tabs} mountNotification={props.mountNotification} />
      </Popover.Content>
    </Popover.Root>
  );
};
