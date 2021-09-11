import * as React from 'react';
import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';

import type * as Radix from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * AccessibleIcon
 * -----------------------------------------------------------------------------------------------*/

const ROOT_NAME = 'AccessibleIcon';

interface AccessibleIconProps extends Radix.PrimitivePrivateProps {
  /**
   * The accessible label for the icon. This label will be visually hidden but announced to screen
   * reader users, similar to `alt` text for `img` tags.
   */
  label: string;
}

const AccessibleIcon: React.FC<AccessibleIconProps> = (props) => {
  const { __scope = ROOT_NAME, __part = ROOT_NAME, children, label } = props;
  const child = React.Children.only(children);
  return (
    <>
      {React.cloneElement(child as React.ReactElement, {
        // accessibility
        'aria-hidden': 'true',
        focusable: 'false', // See: https://allyjs.io/tutorials/focusing-in-svg.html#making-svg-elements-focusable
      })}
      <VisuallyHiddenPrimitive.Root __scope={__scope} __part={__part}>
        {label}
      </VisuallyHiddenPrimitive.Root>
    </>
  );
};

AccessibleIcon.displayName = ROOT_NAME;

/* -----------------------------------------------------------------------------------------------*/

const Root = AccessibleIcon;

export {
  AccessibleIcon,
  //
  Root,
};
export type { AccessibleIconProps };
