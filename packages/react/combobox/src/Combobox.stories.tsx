import * as React from 'react';
import * as Combobox from '@radix-ui/react-combobox';

export default { title: 'Components/Combobox' };

export const Styled = () => (
  <div style={{ display: 'flex', gap: 20, padding: 50 }}>
    {/* <Combobox.Root> */}
    {/*   <Combobox.Trigger>Open ▼</Combobox.Trigger> */}
    {/*   <Combobox.Content style={{ backgroundColor: 'whitesmoke', width: '100%' }} sideOffset={10}> */}
    {/*     <Combobox.Input /> */}
    {/*     <Combobox.List style={{ padding: 10 }}> */}
    {/*       <Combobox.Item>Apple</Combobox.Item> */}
    {/*       <Combobox.Item>Banana</Combobox.Item> */}
    {/*       <Combobox.Item>Berry</Combobox.Item> */}
    {/*     </Combobox.List> */}
    {/*   </Combobox.Content> */}
    {/* </Combobox.Root> */}
    {/* <Combobox.Root> */}
    {/*   <Combobox.Anchor> */}
    {/*     <Combobox.Input /> */}
    {/*     <Combobox.Open>▼</Combobox.Open> */}
    {/*   </Combobox.Anchor> */}
    {/*   <Combobox.Content style={{ backgroundColor: 'whitesmoke', width: 'auto' }} sideOffset={10}> */}
    {/*     <Combobox.List style={{ padding: 10 }}> */}
    {/*       <Combobox.Item>Apple</Combobox.Item> */}
    {/*       <Combobox.Item>Banana</Combobox.Item> */}
    {/*       <Combobox.Item>Berry</Combobox.Item> */}
    {/*     </Combobox.List> */}
    {/*   </Combobox.Content> */}
    {/* </Combobox.Root> */}
    <Combobox.Root>
      <Combobox.Input />
      <Combobox.Content style={{ backgroundColor: 'whitesmoke', width: '100%' }} sideOffset={10}>
        <Combobox.List style={{ padding: 10 }}>
          <Combobox.Item>Apple</Combobox.Item>
          <Combobox.Item>Banana</Combobox.Item>
          <Combobox.Item>Berry</Combobox.Item>
        </Combobox.List>
      </Combobox.Content>
    </Combobox.Root>
  </div>
);
